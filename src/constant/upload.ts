import { UploadProps } from '@winglab/react-form';
import Cookies from 'js-cookie';

export const uploadServer: UploadProps['server'] = {
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
  headers: {
    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN') ?? '',
  },
  patch: { url: '/api/filepond?patch=', withCredentials: true },
  revert: { url: '/api/filepond', withCredentials: true },
  process: { url: '/api/filepond', withCredentials: true },
};