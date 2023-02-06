const apiBaseUrl = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:4000';

const apiRequest = async (path: string, requestInit?: RequestInit): Promise<Response> => {
  // const idToken = await auth.currentUser?.getIdToken();
  const _requestInit: RequestInit = requestInit ?? {};
  const _headers = _requestInit.headers ?? {};
  const url = new URL(path, apiBaseUrl).toString();

  return await fetch(url, {
    ..._requestInit,
    headers: {
      // Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
      ..._headers,
    },
    credentials: 'include', // for cookies
  });
};

export { apiRequest };
