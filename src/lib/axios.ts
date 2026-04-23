import { ApiResponse } from '@/service/response';
import { default as Axios, AxiosResponse } from 'axios';

const axios = Axios.create();

axios.defaults.withXSRFToken = true;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

        if (code === 0) {
            return response;
        }

        throw { code, message, errors };
    },
    (error) => {
        return error;
    },
);

async function unpack<TData>(request: Promise<AxiosResponse<ApiResponse<TData>>>) {
    try {
        return (await request).data?.data;
    } catch (error) {
        if (typeof window === 'undefined') {
            console.error('Server call api Error: ', error);
        } else {
            console.error('Client call api error: ', error);
        }
        throw error;
    }
}

export { axios, unpack };
