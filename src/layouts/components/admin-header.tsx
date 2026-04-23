import { Separator } from '@/components/shadcn/separator';
import { SidebarTrigger } from '@/components/shadcn/sidebar';

import { Breadcrumb } from '@/components/winglab/breadcrumb';
import { RouteItemGroup } from '@/constant/routes';
import { useRouteBreadcrumbs } from '@/hooks/use-routes';
import styles from '../admin.module.css';

export function AdminHeader({ menu, title }: { menu: RouteItemGroup[]; title?: string }) {
    const breadcrumb = useRouteBreadcrumbs(menu);

    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" />
                <Breadcrumb items={title ? [...breadcrumb, { label: title }] : breadcrumb} />
            </div>
        </header>
    );
}
