import { axios, unpack } from '@/lib/axios';

export async function login(data: unknown) {
    await axios.get('/api/csrf-cookie');
    return unpack(axios.post('/api/login'));
}

export async function getProfile() {
    return unpack(axios.get('/api/profile'));
}
