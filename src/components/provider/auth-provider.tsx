'use client';

import { profileShow } from '@/service/api/auth';
import { User } from '@/service/model';
import { createContext, PropsWithChildren, useContext } from 'react';
import useSWR from 'swr';

type AuthType = { data?: User; mutate: (user?: User) => void } | null;

export const useAuth = () => useContext(AuthContext);
export const AuthContext = createContext<AuthType>(null);

export function AuthProvider({ initialUser, children }: PropsWithChildren<{ initialUser?: User }>) {
  const { data, mutate } = useSWR('/api/profile', profileShow, {
    fallbackData: initialUser,
    refreshInterval: 1000 * 30,
  });

  return <AuthContext.Provider value={{ data, mutate }}>{children}</AuthContext.Provider>;
}
