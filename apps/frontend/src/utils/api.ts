import { initClient } from '@ts-rest/core';
import { contract } from 'contract';
import { getAuthToken } from './auth';

export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
};

// Contract-based API client matching OneApp's ts-rest architecture
export const api = initClient(contract, {
  baseUrl: getApiUrl(),
  baseHeaders: {},
  api: async ({ path, method, headers, body }) => {
    const token = getAuthToken();
    const finalHeaders = new Headers(headers as HeadersInit);

    if (token) {
      finalHeaders.set('authorization', `Bearer ${token}`);
    }

    const url = path.startsWith('http') ? path : `${getApiUrl()}${path}`;

    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body as BodyInit,
    });

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    return {
      status: response.status,
      body: data,
      headers: response.headers,
    };
  },
});
