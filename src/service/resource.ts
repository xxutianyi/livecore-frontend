import { PaginateData } from '@/components/data-table';
import { axios, unpack } from '@/lib/axios';

export function resourceApi<TData>(path: string) {
  async function index(params?: Record<string, any>) {
    return unpack<PaginateData<TData>>(axios.get(`${path}`, { params }));
  }

  async function store(data: Partial<TData> & Record<string, any>) {
    return unpack<TData>(axios.post(`${path}`, data));
  }

  async function show(id: TData[keyof TData]) {
    return unpack<TData>(axios.get(`${path}/$${id}`));
  }

  async function update(id: TData[keyof TData], data: Partial<TData> & Record<string, any>) {
    return unpack<TData>(axios.put(`${path}/${id}`, data));
  }

  async function destroy(id: TData[keyof TData]) {
    return unpack<undefined>(axios.delete(`${path}/$${id}`));
  }

  return { index, store, show, update, destroy };
}
