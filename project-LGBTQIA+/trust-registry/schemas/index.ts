import { z } from 'zod';
import { 
  TrustStatus, 
  TrustLevel,
  TrustSource,
  TrustOrganization,
  TrustService,
  TrustContent 
} from '../../src/types/trust.js';

// Enums baseados em src/types/trust.ts (necessário replicar os valores pro Zod string literals)
export const trustStatusSchema = z.enum(['submitted', 'under_review', 'verified_basic', 'community_reviewed', 'validated', 'partner', 'rejected', 'archived']);
export const trustLevelSchema = z.enum(['none', 'basic', 'verified', 'certified']);

export const trustSourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  type: z.enum(['government', 'ngo', 'academic', 'media', 'community', 'other']),
  reliability_score: z.number().min(0).max(100),
  last_verified: z.string().datetime(),
  status: trustStatusSchema
});

export const trustOrganizationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['public', 'ngo', 'private', 'collective', 'other']),
  status: trustStatusSchema,
  contact: z.object({
    email: z.string().email().nullable().optional(),
    phone: z.string().nullable().optional(),
    website: z.string().url().nullable().optional(),
    publicAddressAllowed: z.boolean().default(false)
  }).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  source_id: z.string()
});

export const trustServiceSchema = z.object({
  id: z.string().min(1),
  organization_id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.array(z.string()).min(1),
  status: trustStatusSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  source_id: z.string()
});

export const evidenceSchema = z.object({
  id: z.string().min(1),
  entity_id: z.string().min(1),
  entity_type: z.enum(['source', 'organization', 'service', 'content']),
  source_url: z.string().url(),
  consultation_date: z.string().datetime(),
  extracted_info: z.string().min(1),
  limitations: z.string().nullable().optional(),
  needs_additional_confirmation: z.boolean().default(false)
});

export const reviewQueueItemSchema = z.object({
  id: z.string().min(1),
  entity_id: z.string().min(1),
  entity_type: z.enum(['source', 'organization', 'service', 'content']),
  entity_name: z.string().min(1),
  current_status: trustStatusSchema,
  missing_fields: z.array(z.string()),
  found_sources: z.array(z.string()),
  risks: z.array(z.string()),
  pending_questions: z.array(z.string()),
  agent_recommendation: z.enum(['continue_review', 'block', 'request_evidence', 'eligible_for_human_validation']),
  human_decision_pending: z.boolean().default(true)
});

export const validationSchema = z.object({
  id: z.string().min(1),
  entity_id: z.string().min(1),
  validator_id: z.string(), // e.g. 'human-review-pending'
  validator_role: z.string(),
  decision: z.enum(['approved', 'rejected', 'more_info_needed']),
  validation_date: z.string().datetime(),
  observations: z.string().nullable().optional(),
  valid_until: z.string().datetime().nullable().optional(),
  evidence_examined: z.array(z.string())
});

export const registrySchema = z.object({
  sources: z.array(trustSourceSchema),
  organizations: z.array(trustOrganizationSchema),
  services: z.array(trustServiceSchema),
  evidence: z.array(evidenceSchema),
  validations: z.array(validationSchema),
  reviewQueue: z.array(reviewQueueItemSchema)
});
