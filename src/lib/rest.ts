import { axios, unpack } from '@/lib/axios';
import { Model } from '@/service/model';
import { DataParams, DataResult } from '@winglab/react-table';

export type Api<TData extends Model> = {
  index: (params?: DataParams) => Promise<TData[]>;
  store: (data?: Partial<TData>) => Promise<TData>;
  show: (id: TData['id'], params?: DataParams) => Promise<TData>;
  update: (id: TData['id'], data?: Partial<TData>) => Promise<TData>;
  destroy: (id: TData['id'], params?: DataParams) => Promise<undefined>;
};

export type PaginateApi<TData extends Model> = Omit<Api<TData>, 'index'> & {
  index: (params?: DataParams) => Promise<DataResult<TData>>;
};

export function restApi<TData extends Model>(path: string): Api<TData>;
export function restApi<TData extends Model>(path: string, paginate: true): PaginateApi<TData>;

export function restApi<TData extends Model>(path: string, paginate: boolean = true) {
  async function index(params?: DataParams) {
    return !paginate
      ? unpack<TData[]>(axios.get(path, { params }))
      : unpack<DataResult<TData>>(axios.get(path, { params }));
  }

  async function store(data?: Partial<TData>) {
    return unpack<TData>(axios.post(path, data));
  }

  async function show(id: TData['id'], params?: DataParams) {
    return unpack<TData>(axios.get(path + '/' + id, { params }));
  }

  async function update(id: TData['id'], data?: Partial<TData>) {
    return unpack<TData>(axios.put(path + '/' + id, data));
  }

  async function destroy(id: TData['id'], params?: DataParams) {
    return unpack<undefined>(axios.delete(path + '/' + id, { params }));
  }

  return { index, store, show, update, destroy };
}
