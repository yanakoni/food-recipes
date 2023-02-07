import { UserState } from '../store/redux/reducer/user/type';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:4000';

const protectedApiRequest = async (
  path: string,
  user: UserState,
  updateUserTokens: (accessToken: string, refreshToken: string) => void,
  requestInit?: RequestInit
): Promise<any> => {
  const _requestInit: RequestInit = requestInit ?? {};
  const _headers = _requestInit.headers ?? {};
  const url = new URL(path, apiBaseUrl).toString();

  const response = await fetch(url, {
    ..._requestInit,
    headers: {
      'Content-Type': 'application/json',
      ..._headers,
    },
    credentials: 'include', // for cookies
  });

  const jsonResponse = await response.json();

  if (jsonResponse.accessToken && jsonResponse.refreshToken) {
    updateUserTokens(jsonResponse.accessToken, jsonResponse.refreshToken);
    cookies.set('user', window.btoa(JSON.stringify({ ...user, accessToken: jsonResponse.accessToken, refreshToken: jsonResponse.refreshToken })));
    const response = await fetch(url, {
      ..._requestInit,
      headers: {
        'Content-Type': 'application/json',
        ..._headers,
        'Access-Token': `Bearer ${jsonResponse.accessToken}`,
        'Refresh-Token': jsonResponse.refreshToken,
      },
      credentials: 'include', // for cookies
    });

    return await response.json();
  }
  return jsonResponse;
};

export { protectedApiRequest };
