import { settingsGroupsOptions, settingsRoomsOptions } from '@/service/requests';
import useSWR from 'swr';

export function useOptions() {
  const { data: rooms } = useSWR('roomsOptions', () => settingsRoomsOptions());
  const { data: groups } = useSWR('groupsOptions', () => settingsGroupsOptions());

  return { rooms, groups };
}
