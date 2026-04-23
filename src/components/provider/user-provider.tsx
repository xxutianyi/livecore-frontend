'use client';

import { profileShow } from '@/service/api/auth';
import { User } from '@/service/model';
import { usePathname } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

type UserContextType = { user?: User; setUser: (user?: User) => void };

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ initialUser, children }: PropsWithChildren<{ initialUser?: User }>) {
    const pathname = usePathname();
    const [user, setUser] = useState<User | undefined>(initialUser);

    useEffect(() => {
        profileShow().then(setUser);
    }, [pathname]);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export const useUserContext = () => useContext(UserContext);
