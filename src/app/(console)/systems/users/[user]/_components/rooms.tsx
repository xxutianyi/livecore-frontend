'use client';

import { Section } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldGroup } from '@/components/ui/field';
import { useOptions } from '@/hooks/use-options';
import { LiveRoom, User } from '@/service/model';
import { settingsAdminsManageable } from '@/service/requests';
import { Form, MutiSelectField } from '@winglab/react-form';
import { ColumnsDef, Table } from '@winglab/react-table';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function RoomIndex({ user }: { user: User }) {
  const columns = ColumnsDef<LiveRoom>([
    {
      dataKey: 'name',
      title: '封面',
      tableRowRender: (data) => (
        <div className="aspect-video max-h-8">
          <img alt="cover" src={data.cover} className="h-full w-full rounded-lg border" />
        </div>
      ),
    },
    {
      dataKey: 'name',
      title: '直播间',
    },
    {
      dataKey: 'description',
      title: '简介',
    },
    {
      index: 'actions',
      width: '200px',
      tableRowRender: (data) => {
        return (
          <Button asChild variant="secondary">
            <Link href={'/settings/rooms/' + data.id}>详情</Link>
          </Button>
        );
      },
    },
  ]);

  return (
    <Section title="可管理的直播间">
      {user.role === 'admin' && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldCheck />
            </EmptyMedia>
            <EmptyTitle>系统管理员</EmptyTitle>
            <EmptyDescription>该用户可管理全部直播间</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {user.role === 'room-admin' && <Table data={user.manageable} columns={columns} />}
    </Section>
  );
}

export function RoomUpdate({ user }: { user: User }) {
  const router = useRouter();
  const { rooms } = useOptions();
  const [open, setOpen] = useState(false);

  if (user.role === 'admin') return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>修改授权</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>授权直播间</DialogTitle>
        </DialogHeader>
        <Form
          initialValues={{ room_ids: user.manageable?.map((room) => room.id) }}
          onSubmit={async (values) => {
            await settingsAdminsManageable(user.id, values);
            setOpen(false);
            toast.success('保存成功');
            router.refresh();
          }}
        >
          <FieldGroup>
            <MutiSelectField
              label="授权的直播间"
              name="room_ids"
              options={rooms ?? []}
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
