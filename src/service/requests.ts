import { axios, unpack } from '@/lib/axios';
import { ApiResponse } from '@/service/response';

export async function login(data: unknown) {
    await axios.get('/api/csrf-cookie');
    return unpack(axios.post('/api/login', data));
}

export async function getProfile() {
    return unpack(axios.get<ApiResponse<{ name: string }>>('/api/profile'));
}
