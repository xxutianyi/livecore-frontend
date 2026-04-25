import { userGroupsIndex } from '@/service/api/settings';
import useSWR from 'swr';

export function useOptions() {
  const { data: groups } = useSWR('/api/settings/groups', userGroupsIndex);

  return { groups };
}
