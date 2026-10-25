import { authContract } from './auth/contract';
import { personalityContract } from './personality/contract';
import { uploadContract } from './upload/contract';

export * from './auth/types';
export * from './auth/contract';
export * from './personality/types';
export * from './personality/contract';
export * from './upload/types';
export * from './upload/contract';

export const contract = {
  auth: authContract,
  personality: personalityContract,
  upload: uploadContract,
};

export type Contract = typeof contract;

