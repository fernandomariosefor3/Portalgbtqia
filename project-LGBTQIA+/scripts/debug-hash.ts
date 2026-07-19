import fs from 'fs';
import crypto from 'crypto';

function computeFingerprintV1(data: any): string {
  const str = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}

const evidence = JSON.parse(fs.readFileSync('trust-registry/pilot-fortaleza/evidence.json', 'utf8'));
const vals = JSON.parse(fs.readFileSync('trust-registry/pilot-fortaleza/validations.json', 'utf8'));

const val = vals.find((v: any) => v.entityId === 'src_gov_ce');

console.log('Stored evidenceFingerprint:', val.evidenceFingerprint);

const evList = evidence.filter((e: any) => e.entityId === 'src_gov_ce');
console.log('Computed V1 evidenceList:', computeFingerprintV1(evList));
