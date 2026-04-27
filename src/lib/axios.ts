import { default as Axios, AxiosResponse } from 'axios';
import { toast } from 'sonner';

export type ValidateError = Record<string, string[]>;
export type ApiRequest<TData = any> = Promise<AxiosResponse<ApiResponse<TData>>>;
export type ApiResponse<TData = any> = { data?: TData; code: number; message: string; errors?: ValidateError };

const axios = Axios.create();
axios.defaults.withXSRFToken = true;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

axios.interceptors.request.use(async (request) => {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    request.headers.set('Cookie', cookieStore.toString());
    request.headers.set('Origin', process.env.NEXT_PUBLIC_URL);
    request.headers.set('X-XSRF-TOKEN', cookieStore.get('XSRF-TOKEN')?.value);
  }

  return request;
});

axios.interceptors.response.use((response) => {
  if (!response.data) {
    return response;
  }
  if (response.data.code && response.data.code !== 0) {
    throw response.data;
  }
  return response;
});

async function unpack<TData>(request: ApiRequest<TData>) {
  try {
    return (await request).data?.data;
  } catch (error: any) {
    console.log(error);
    if (typeof window !== 'undefined') {
      if (error.code === 4003 && error.errors) {
        throw error.errors;
      }
      if (![4001, 4002].includes(error.code)) {
        toast.error(error.message);
        throw error;
      }
    }
    return undefined;
  }
}

export { axios, unpack };
