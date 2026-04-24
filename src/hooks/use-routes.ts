'use client';

import { useUserContext } from '@/components/provider/user-provider';
import { RouteItemGroup } from '@/constant/routes';
import { usePathname } from 'next/navigation';

export function useRoutes(routes: RouteItemGroup[]): RouteItemGroup[] {
  const pathname = usePathname();
  const userContext = useUserContext();
  const userRole = userContext?.user?.role ?? '';

  function isActive(href?: string) {
    return (href && pathname === href) || pathname.startsWith(href + '/');
  }

  return routes
    .map((group) => ({
      ...group,
      items: group.items
        ?.map((item) => {
          if (item.roles && !item.roles.includes(userRole)) {
            return undefined;
          }

          if (item.children && item.children.length > 0) {
            let hasActiveChild = false;

            const children = item.children
              .map((child) => {
                const childActive = isActive(child.href);

                if (childActive) {
                  hasActiveChild = true;
                }

                if (child.roles && !child.roles.includes(userRole)) {
                  return undefined;
                }

                return { ...child, isActive: childActive };
              })
              .filter((child) => !!child);

            return { ...item, children, isActive: hasActiveChild };
          }

          return { ...item, isActive: isActive(item.href) };
        })
        .filter((item) => !!item),
    }))
    .filter((group) => group.items && group.items.length > 0);
}
