# @winglab/react-table

A react data-table component using shadcn/ui.

### Install Component
```bash
# Component
npm install -D @winglab/react-table
```

## Use In Pages/Components

```tsx
// user/index.tsx
import { defineColumns, DataTable, type PaginateData } from '@winglab/react-table';
import { ServerTable } from './server-table';

export default function Users({ data }: { data: PaginateData<UserType> }) {
    const columns = defineColumns<UserType>([
        {
            dataKey: 'name',
            title: 'User',
            sortable: true,
        },
        {
            dataKey: 'phone',
            title: 'Phone',
            sortable: true,
        },
        {
            dataKey: 'email',
            title: 'Email',
            sortable: true,
        },
        {
            dataKey: 'role',
            title: 'Role',
            tableRowRender: (data) => (
                <>
                    {data.role === 'user' && 'User'}
                    {data.role === 'admin' && 'Admin'}
                </>
            ),
            filter: [
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' },
            ],
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <Button asChild variant="secondary">
                        <Link href={route('users.show', data.id)}>View</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <Layout>
            <ServerTable columns={columns} request={async (params) => {
                return { data, total };
            }} />
        </Layout>
    );
}

```


#### use frontend pagination

```tsx
// user/index.tsx
import {defineColumns, SimpleTable} from '@winglab/react-table';

export default function Users({data}: { data: UserType[] }) {
    const columns = defineColumns<UserType>([
        {
            dataKey: 'name',
            title: 'User',
            sortable: true,
        },
        {
            dataKey: 'phone',
            title: 'Phone',
            sortable: true,
        },
        {
            dataKey: 'email',
            title: 'Email',
            sortable: true,
        },
        {
            dataKey: 'role',
            title: 'Role',
            tableRowRender: (data) => (
                <>
                    {data.role === 'user' && 'User'}
                    {data.role === 'admin' && 'Admin'}
                </>
            ),
            filter: [
                {label: 'User', value: 'user'},
                {label: 'Admin', value: 'admin'},
            ],
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <Button asChild variant="secondary">
                        <Link href={route('users.show', data.id)}>View</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <Layout>
            <SimpleTable columns={columns} data={data}/>
        </Layout>
    );
}
```