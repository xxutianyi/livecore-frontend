import { axios, unpack } from '@/lib/axios';
import { User } from '@/service/model';

export async function login(data: unknown) {
    await axios.get('/api/csrf-cookie');
    return unpack<User>(axios.post('/api/login', data));
}

export async function logout() {
    return unpack(axios.post('/api/logout'));
}

export async function profileShow() {
    return unpack<User>(axios.get('/api/profile'));
}

export async function profileUpdate(data: unknown) {
    return unpack<User>(axios.post('/api/profile', data));
}

export async function passwordUpdate(data: unknown) {
    return unpack<User>(axios.post('/api/password', data));
}
