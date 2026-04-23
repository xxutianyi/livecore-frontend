import { toFormError } from '@/lib/validate';
import { ApiResponse } from '@/service/response';
import { default as Axios, AxiosResponse } from 'axios';

const axios = Axios.create();

axios.defaults.withXSRFToken = true;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

axios.interceptors.request.use(
    async (request) => {
        if (typeof window === 'undefined') {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();

            request.headers.set('Cookie', cookieStore.toString());
            request.headers.set('Origin', process.env.NEXT_PUBLIC_URL);
            request.headers.set('X-XSRF-TOKEN', cookieStore.get('XSRF-TOKEN')?.value);
        }

        return request;
    },
    async (error) => {
        return error;
    },
);

axios.interceptors.response.use(
    (response) => {
        if (!response.data) {
            return response;
        }

        const { code, message, errors } = response.data as ApiResponse;

        if (code && code !== 0) {
            throw { code, message, errors };
        }

        return response;
    },
    (error) => {
        return error;
    },
);

async function unpack<TData>(request: Promise<AxiosResponse<ApiResponse<TData>>>) {
    try {
        return (await request).data?.data;
    } catch (error: any) {
        if (typeof window === 'undefined') {
            console.log('Server call api Error: ', error);
        } else {
            console.log('Client call api error: ', error);
        }
        if (error.code === 4003 && error.errors) {
            throw toFormError(error);
        }
        return undefined;
    }
}

export { axios, unpack };
