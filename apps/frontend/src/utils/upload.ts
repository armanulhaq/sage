import { api } from './api';

export async function uploadFile(
  file: File,
  folder: 'avatars' | 'sources' = 'avatars',
): Promise<string> {
  // 1. Get presigned URL from backend
  const res = await api.upload.getPresignedUrl({
    body: {
      fileName: file.name,
      fileType: file.type,
      folder,
    },
  });

  if (res.status !== 200) {
    throw new Error('Failed to get upload URL');
  }

  const { uploadUrl, fileUrl } = res.body;

  // 2. Direct PUT to S3
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error('Failed to upload file to S3');
  }

  // 3. Return the public S3 URL
  return fileUrl;
}
