import { initContract } from '@ts-rest/core';
import { PresignedUrlInputSchema, PresignedUrlResponseSchema } from './types';
import { ErrorResponseSchema } from '../auth/types';

const c = initContract();

export const uploadContract = c.router(
  {
    getPresignedUrl: {
      method: 'POST',
      path: '/presigned-url',
      body: PresignedUrlInputSchema,
      responses: {
        200: PresignedUrlResponseSchema,
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
      },
      description: 'Get an S3 pre-signed upload URL for direct file upload',
    },
  },
  {
    pathPrefix: '/upload',
  },
);
