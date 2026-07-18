import { describe, it, expect } from 'vitest';
import { computeFingerprintV1, computeFingerprintV2, compareFingerprint } from '../lib/humanReview.js';

describe('Fingerprint Algorithm', () => {
  it('v1 reproduces known legacy fingerprints', () => {
    // This assumes an object with keys out of order
    const obj = { b: 2, a: 1 };
    const hash = computeFingerprintV1(obj);
    const obj2 = { a: 1, b: 2 };
    const hash2 = computeFingerprintV1(obj2);
    // v1 only sorts top level keys, so they should match
    expect(hash).toBe(hash2);
  });

  it('v2 ignores volatile fields', () => {
    const obj1 = { id: 'test', generatedAt: '2026-07-18T10:00:00Z', data: 'value' };
    const obj2 = { id: 'test', generatedAt: '2026-07-19T10:00:00Z', data: 'value' };
    
    expect(computeFingerprintV2(obj1)).toBe(computeFingerprintV2(obj2));
  });

  it('v2 preserves semantically important dates', () => {
    const obj1 = { id: 'test', reviewedAt: '2026-07-18T10:00:00Z' };
    const obj2 = { id: 'test', reviewedAt: '2026-07-19T10:00:00Z' };
    
    expect(computeFingerprintV2(obj1)).not.toBe(computeFingerprintV2(obj2));
  });

  it('v2 sorts keys deeply', () => {
    const obj1 = { a: { c: 3, b: 2 }, d: 4 };
    const obj2 = { d: 4, a: { b: 2, c: 3 } };
    
    expect(computeFingerprintV2(obj1)).toBe(computeFingerprintV2(obj2));
  });

  it('v2 treats evidenceIds as unordered array', () => {
    const obj1 = { evidenceIds: ['ev_2', 'ev_1'] };
    const obj2 = { evidenceIds: ['ev_1', 'ev_2'] };
    
    expect(computeFingerprintV2(obj1)).toBe(computeFingerprintV2(obj2));
  });

  it('v2 treats other arrays as semantically ordered', () => {
    const obj1 = { steps: ['step_1', 'step_2'] };
    const obj2 = { steps: ['step_2', 'step_1'] };
    
    expect(computeFingerprintV2(obj1)).not.toBe(computeFingerprintV2(obj2));
  });

  it('compareFingerprint handles v1 correctly', () => {
    const data = { id: 'test' };
    const v1Hash = computeFingerprintV1(data);
    
    const result = compareFingerprint(v1Hash, 'v1', data);
    expect(result.matches).toBe(true);
    expect(result.reason).toBe('MATCH_LEGACY');
  });

  it('compareFingerprint handles missing version as v1', () => {
    const data = { id: 'test' };
    const v1Hash = computeFingerprintV1(data);
    
    const result = compareFingerprint(v1Hash, undefined, data);
    expect(result.matches).toBe(true);
    expect(result.reason).toBe('MATCH_LEGACY');
  });

  it('compareFingerprint handles v2 correctly', () => {
    const data = { id: 'test' };
    const v2Hash = computeFingerprintV2(data);
    
    const result = compareFingerprint(v2Hash, 'v2', data);
    expect(result.matches).toBe(true);
    expect(result.reason).toBe('MATCH');
  });

  it('compareFingerprint fails securely if content changed in v1', () => {
    const data1 = { id: 'test' };
    const data2 = { id: 'test2' };
    const v1Hash = computeFingerprintV1(data1);
    
    const result = compareFingerprint(v1Hash, 'v1', data2);
    expect(result.matches).toBe(false);
    expect(result.reason).toBe('CONTENT_CHANGED');
  });
});
