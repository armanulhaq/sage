import { z } from 'zod';

export const PersonalityStatusEnum = z.enum([
  'PRIVATE',
  'PENDING_APPROVAL',
  'APPROVED',
]);
export type PersonalityStatus = z.infer<typeof PersonalityStatusEnum>;

export const SourceTypeEnum = z.enum([
  'BOOK',
  'SPEECH',
  'ARTICLE',
  'INTERVIEW',
  'LETTER',
  'ESSAY',
  'CUSTOM_TEXT',
]);
export type SourceType = z.infer<typeof SourceTypeEnum>;

export const CreatePersonalitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  avatar: z.string().url('Avatar must be a valid URL').nullable().optional(),
  voiceTone: z.string().nullable().optional(),
  isPublic: z.boolean().default(false),
});

export const PersonalityResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string(),
  avatar: z.string().nullable(),
  voiceTone: z.string().nullable(),
  status: PersonalityStatusEnum,
  creatorId: z.string(),
  creatorName: z.string(),
  sourcesCount: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreatePersonalityInput = z.infer<typeof CreatePersonalitySchema>;
export type PersonalityResponse = z.infer<typeof PersonalityResponseSchema>;
