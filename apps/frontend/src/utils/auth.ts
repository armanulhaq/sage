import Cookies from 'js-cookie';

export const AUTH_TOKEN_COOKIE = 'sage_token';

export const setAuthToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_COOKIE, token, { expires: 7, sameSite: 'lax' }); //lax means send this cookie only when user is on our website
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_TOKEN_COOKIE);
};

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_COOKIE);
};

export const logout = () => {
  removeAuthToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
