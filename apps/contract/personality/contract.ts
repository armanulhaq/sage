import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  CreatePersonalitySchema,
  PersonalityResponseSchema,
} from './types';
import { ErrorResponseSchema } from '../auth/types';

const c = initContract();

export const personalityContract = c.router(
  {
    create: {
      method: 'POST',
      path: '',
      body: CreatePersonalitySchema,
      responses: {
        201: PersonalityResponseSchema,
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
      },
      description: 'Create a new personality (private by default or pending approval)',
    },
    list: {
      method: 'GET',
      path: '',
      responses: {
        200: z.array(PersonalityResponseSchema),
        401: ErrorResponseSchema,
      },
      description: 'List accessible personalities (public approved + user-created private ones)',
    },
    get: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({
        id: z.string(),
      }),
      responses: {
        200: PersonalityResponseSchema,
        401: ErrorResponseSchema,
        404: ErrorResponseSchema,
      },
      description: 'Get details of a single personality by ID',
    },
  },
  {
    pathPrefix: '/personalities',
  },
);
