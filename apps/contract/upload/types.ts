import { z } from 'zod';

export const UploadFolderEnum = z.enum(['avatars', 'sources']);
export type UploadFolder = z.infer<typeof UploadFolderEnum>;

export const PresignedUrlInputSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File MIME type is required'),
  folder: UploadFolderEnum.default('avatars'),
});

export const PresignedUrlResponseSchema = z.object({
  uploadUrl: z.string(),
  fileUrl: z.string(),
  key: z.string(),
});

export type PresignedUrlInput = z.infer<typeof PresignedUrlInputSchema>;
export type PresignedUrlResponse = z.infer<typeof PresignedUrlResponseSchema>;
