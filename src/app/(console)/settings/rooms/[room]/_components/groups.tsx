'use client';

import { Section } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { useOptions } from '@/hooks/use-options';
import { LiveRoom, UserGroup } from '@/service/model';
import { settingsRoomsGroups } from '@/service/requests';
import { Form, MutiSelectField } from '@winglab/react-form';
import { ColumnsDef, Table } from '@winglab/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function GroupIndex({ groups }: { groups?: UserGroup[] }) {
  const columns = ColumnsDef<UserGroup>([
    {
      dataKey: 'name',
      title: '名称',
      sortable: true,
    },
    {
      dataKey: 'users_count',
      title: '用户数',
      sortable: true,
    },
    {
      index: 'action',
      width: '20%',
      tableRowRender: (data) => (
        <Button asChild variant="secondary">
          <Link href={`/settings/users?groups=${data.id}`}>用户</Link>
        </Button>
      ),
    },
  ]);

  return (
    <Section title="授权用户组">
      <Table data={groups} columns={columns} />
    </Section>
  );
}

export function GroupUpdate({ room }: { room: LiveRoom }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { groups } = useOptions();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>修改授权</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>授权用户组</DialogTitle>
        </DialogHeader>
        <Form
          initialValues={{ groups: room.groups?.map((g) => g.id) }}
          onSubmit={async (values) => {
            await settingsRoomsGroups(room.id, values);
            setOpen(false);
            toast.success('保存成功');
            router.refresh();
          }}
        >
          <FieldGroup>
            <MutiSelectField
              name="group_ids"
              label="选择分组"
              options={groups ?? []}
              optionsKey={{ label: 'name', value: 'id' }}
            />
            <Field>
              <Button type="submit">保存</Button>
            </Field>
          </FieldGroup>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
