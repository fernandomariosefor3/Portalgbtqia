import fs from 'fs';
import path from 'path';
import { 
  registrySchema, 
  trustSourceSchema, 
  trustOrganizationSchema, 
  trustServiceSchema, 
  evidenceSchema, 
  validationSchema, 
  reviewQueueItemSchema 
} from '../trust-registry/schemas/index.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

async function validateRegistry() {
  console.log('Validating Trust Registry...');
  
  const sources = loadJson('sources.json');
  const orgs = loadJson('organizations.json');
  const services = loadJson('services.json');
  const evidence = loadJson('evidence.json');
  const validations = loadJson('validations.json');
  const reviewQueue = loadJson('review-queue.json');

  let hasErrors = false;
  const errors: string[] = [];

  const addError = (msg: string) => {
    errors.push(msg);
    hasErrors = true;
  };

  // 1. Zod schema validation
  const parsedSources = zArrayValidate(sources, trustSourceSchema, 'sources');
  const parsedOrgs = zArrayValidate(orgs, trustOrganizationSchema, 'organizations');
  const parsedServices = zArrayValidate(services, trustServiceSchema, 'services');
  const parsedEvidence = zArrayValidate(evidence, evidenceSchema, 'evidence');
  const parsedValidations = zArrayValidate(validations, validationSchema, 'validations');
  const parsedReviewQueue = zArrayValidate(reviewQueue, reviewQueueItemSchema, 'review-queue');

  function zArrayValidate(data: any, schema: any, name: string) {
    if (!Array.isArray(data)) {
      addError(`${name}.json is not an array.`);
      return [];
    }
    const result = data.map((item, index) => {
      const p = schema.safeParse(item);
      if (!p.success) {
        addError(`${name}[${index}] validation failed: ${p.error.message}`);
        return null;
      }
      return p.data;
    });
    return result.filter(r => r !== null);
  }

  // Combine IDs
  const allIds = new Set<string>();
  const sourceUrls = new Set<string>();
  const sourceIds = new Set<string>();
  const orgIds = new Set<string>();
  const serviceIds = new Set<string>();
  const allEntities = new Set<string>();

  const checkId = (id: string, name: string) => {
    if (allIds.has(id)) addError(`Duplicate ID found across registry: ${id} in ${name}`);
    allIds.add(id);
  };

  parsedSources.forEach((s: any) => {
    checkId(s.id, 'sources');
    sourceIds.add(s.id);
    allEntities.add(s.id);
    if (sourceUrls.has(s.url)) addError(`Duplicate URL in sources: ${s.url}`);
    sourceUrls.add(s.url);
  });

  parsedOrgs.forEach((o: any) => {
    checkId(o.id, 'organizations');
    orgIds.add(o.id);
    allEntities.add(o.id);
    if (!sourceIds.has(o.source_id)) addError(`Organization ${o.id} references missing source_id: ${o.source_id}`);
  });

  parsedServices.forEach((s: any) => {
    checkId(s.id, 'services');
    serviceIds.add(s.id);
    allEntities.add(s.id);
    if (!orgIds.has(s.organization_id)) addError(`Service ${s.id} references missing org: ${s.organization_id}`);
    if (!sourceIds.has(s.source_id)) addError(`Service ${s.id} references missing source: ${s.source_id}`);
  });

  parsedEvidence.forEach((e: any) => {
    checkId(e.id, 'evidence');
    if (!allEntities.has(e.entity_id)) addError(`Evidence ${e.id} references missing entity: ${e.entity_id}`);
  });

  parsedValidations.forEach((v: any) => {
    checkId(v.id, 'validations');
    if (!allEntities.has(v.entity_id)) addError(`Validation ${v.id} references missing entity: ${v.entity_id}`);
  });

  parsedReviewQueue.forEach((rq: any) => {
    checkId(rq.id, 'reviewQueue');
    if (!allEntities.has(rq.entity_id)) addError(`ReviewQueueItem ${rq.id} references missing entity: ${rq.entity_id}`);
  });

  // Forbidden Status
  const checkStatus = (items: any[], type: string) => {
    items.forEach(i => {
      if (['validated', 'verified_basic', 'community_reviewed', 'partner'].includes(i.status || i.current_status)) {
        addError(`${type} ${i.id} has forbidden initial status: ${i.status || i.current_status}`);
      }
    });
  };
  checkStatus(parsedSources, 'sources');
  checkStatus(parsedOrgs, 'organizations');
  checkStatus(parsedServices, 'services');
  checkStatus(parsedReviewQueue, 'reviewQueue');

  // Policy Checks (no "100% seguro", etc)
  const forbiddenPhrases = [
    "100% seguro",
    "local seguro garantido",
    "atendimento garantido",
    "serviço aprovado pela comunidade",
    "parceiro oficial"
  ];

  const checkTextPolicy = (text: string, ref: string) => {
    if (!text) return;
    const lower = text.toLowerCase();
    forbiddenPhrases.forEach(phrase => {
      if (lower.includes(phrase)) addError(`Forbidden phrase "${phrase}" found in ${ref}`);
    });
  };

  parsedServices.forEach((s: any) => {
    checkTextPolicy(s.name, `Service ${s.id} name`);
    checkTextPolicy(s.description, `Service ${s.id} description`);
  });

  if (hasErrors) {
    console.error('Validation failed with errors:');
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
  }

  console.log('Registry validated successfully. No errors found.');
}

validateRegistry().catch(err => {
  console.error(err);
  process.exit(1);
});
