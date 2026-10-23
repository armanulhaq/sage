import { authContract } from './auth/contract';
import { personalityContract } from './personality/contract';

export * from './auth/types';
export * from './auth/contract';
export * from './personality/types';
export * from './personality/contract';

export const contract = {
  auth: authContract,
  personality: personalityContract,
};

export type Contract = typeof contract;
