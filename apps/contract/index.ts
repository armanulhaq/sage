import { authContract } from './auth/contract';

export * from './auth/types';
export * from './auth/contract';

export const contract = {
  auth: authContract,
};

export type Contract = typeof contract;
