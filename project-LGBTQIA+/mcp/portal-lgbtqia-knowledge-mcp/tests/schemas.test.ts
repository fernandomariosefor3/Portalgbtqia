import { describe, it, expect } from 'vitest';
import { searchValidatedContentSchema, getValidatedContentSchema } from '../tools/contentTools.js';
import { searchVerifiedServicesSchema, getVerifiedServiceSchema } from '../tools/serviceTools.js';
import { searchVerifiedSourcesSchema } from '../tools/sourceTools.js';
import { checkInformationFreshnessSchema } from '../tools/freshnessTools.js';

describe('Schemas Strictness Tests', () => {
  it('should reject unknown keys (strict mode)', () => {
    const res = searchValidatedContentSchema.safeParse({ limit: 10, evil_key: 'hacked' });
    expect(res.success).toBe(false);
  });

  it('should enforce limits and constraints', () => {
    // limit max is 20
    const resLimit = searchValidatedContentSchema.safeParse({ limit: 21 });
    expect(resLimit.success).toBe(false);

    // limit min is 1
    const resMin = searchValidatedContentSchema.safeParse({ limit: 0 });
    expect(resMin.success).toBe(false);

    // Id empty is rejected because of trim().min(1)
    const resEmpty = getValidatedContentSchema.safeParse({ id: '   ' });
    expect(resEmpty.success).toBe(false);

    // Valid query
    const resValid = searchValidatedContentSchema.safeParse({ text: 'saúde', limit: 5 });
    expect(resValid.success).toBe(true);
  });
  
  it('should prevent string to number coercion for limits', () => {
    // Passing string instead of number
    const resStr = searchValidatedContentSchema.safeParse({ limit: "10" });
    expect(resStr.success).toBe(false); // strict numbers
  });
});
