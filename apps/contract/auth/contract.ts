import { initContract } from '@ts-rest/core';
import {
  RegisterSchema,
  LoginSchema,
  AuthResponseSchema,
  UserProfileSchema,
  ErrorResponseSchema,
} from './types';

const c = initContract();

export const authContract = c.router(
  {
    register: {
      method: 'POST',
      path: '/register',
      body: RegisterSchema,
      responses: {
        201: AuthResponseSchema,
        409: ErrorResponseSchema,
      },
      description: 'Register a new user account with email and password',
    },
    login: {
      method: 'POST',
      path: '/login',
      body: LoginSchema,
      responses: {
        200: AuthResponseSchema,
        401: ErrorResponseSchema,
      },
      description: 'Login an existing user with email and password',
    },
    getProfile: {
      method: 'GET',
      path: '/me',
      responses: {
        200: UserProfileSchema,
        401: ErrorResponseSchema,
      },
      description: 'Get authenticated user profile from JWT session',
    },
  },
  {
    pathPrefix: '/auth',
  },
);
