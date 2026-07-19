import fs from 'fs';
import path from 'path';
import { evaluatePromotionEligibility, PromotionContext } from '../trust-registry/lib/promotionEligibility.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const REPORT_FILE = path.resolve('trust-registry', 'reports', 'promotion-eligibility-diagnostics.json');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

async function run() {
  const sources = loadJson('sources.json');
  const orgs = loadJson('organizations.json');
  const services = loadJson('services.json');
  const evidence = loadJson('evidence.json');
  const validations = loadJson('validations.json');

  const asOf = new Date('2026-07-18T12:00:00.000Z'); // Force requested date

  const context: PromotionContext = {
    registry: { sources, organizations: orgs, services, evidence, validations },
    asOf,
    computedEligibility: new Map()
  };

  const results: any[] = [];
  const addResult = (entity: any, type: any) => {
    const res = evaluatePromotionEligibility(entity, type, context);
    results.push(res);
  };

  for (const s of sources) addResult(s, 'source');
  for (const o of orgs) addResult(o, 'organization');
  for (const s of services) addResult(s, 'service');

  fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(results, null, 2), 'utf8');

  console.log(`Diagnostics successfully written to ${REPORT_FILE}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
