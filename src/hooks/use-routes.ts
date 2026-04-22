'use client';

import { RouteItemGroup } from '@/constant/routes';
import { usePathname } from 'next/navigation';

export function useRoutes(routes: RouteItemGroup[]): RouteItemGroup[] {
    const pathname = usePathname();
    const userRole = '';

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

export function useRouteBreadcrumbs(routes: RouteItemGroup[]) {
    const items = useRoutes(routes);
    const breadcrumb: { link?: string; label: string }[] = [];

    items.forEach((group) => {
        group.items?.map((item) => {
            if (item.isActive) {
                breadcrumb.push({ label: group.title });
                breadcrumb.push({ label: item.title, link: item.href });
            }

            if (item.children && item.children.length > 0) {
                item.children.forEach((child) => {
                    if (child.isActive) {
                        breadcrumb.push({ label: child.title, link: item.href });
                    }
                });
            }
        });
    });

    return breadcrumb;
}
