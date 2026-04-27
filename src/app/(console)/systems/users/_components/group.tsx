'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { useOptions } from '@/hooks/use-options';
import { UserGroup } from '@/service/model';
import { settingsGroupsDestroy, settingsGroupsStore, settingsGroupsUpdate } from '@/service/requests';
import { Form, MutiSelectField, TextField } from '@winglab/react-form';
import { ColumnsDef, Table } from '@winglab/react-table';
import { useState } from 'react';
import { toast } from 'sonner';
import { mutate } from 'swr';

export function GroupIndex() {
  const { groups } = useOptions();

  const columns = ColumnsDef<UserGroup>([
    {
      dataKey: 'name',
      title: '名字',
    },
    {
      index: 'actions',
      width: '200px',
      tableRowRender: (data) => (
        <div className="space-x-4">
          <GroupUpdate group={data} />
          <GroupDelete group={data} />
        </div>
      ),
    },
  ]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>用户分组</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl!" showCloseButton={false}>
        <div className="flex flex-row items-center justify-between">
          <DialogHeader>
            <DialogTitle>用户分组</DialogTitle>
            <DialogDescription>仅展示有管理权限的直播间的分组，如有疑问请联系管理员</DialogDescription>
          </DialogHeader>
          <GroupCreate />
        </div>
        <Table columns={columns} data={groups} />
      </DialogContent>
    </Dialog>
  );
}

export function GroupCreate() {
  const { rooms } = useOptions();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>新建分组</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建分组</DialogTitle>
        </DialogHeader>
        <Form
          onSubmit={async (values) => {
            await settingsGroupsStore(values);
            setOpen(false);
            toast.success('保存成功');
            await mutate('groupsOptions');
          }}
        >
          <FieldGroup>
            <TextField name="name" label="名称" />
            <MutiSelectField
              label="授权直播间"
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

export function GroupUpdate({ group }: { group: UserGroup }) {
  const { rooms } = useOptions();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">编辑</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑分组</DialogTitle>
        </DialogHeader>
        <Form
          initialValues={{
            name: group.name,
            room_ids: group?.rooms?.map((room) => room.id),
          }}
          onSubmit={async (values) => {
            await settingsGroupsUpdate(group.id, values);
            setOpen(false);
            toast.success('保存成功');
            await mutate('groupsOptions');
          }}
        >
          <FieldGroup>
            <TextField name="name" label="名称" />
            <MutiSelectField
              label="授权直播间"
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

export function GroupDelete({ group }: { group: UserGroup }) {
  const [open, setOpen] = useState(false);

  function handleDelete() {
    settingsGroupsDestroy(group.id).then(() => {
      setOpen(false);
      mutate('groupsOptions');
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">删除</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除分组</DialogTitle>
          <DialogDescription>删除后将解除与用户和直播间的关联，且无法恢复</DialogDescription>
        </DialogHeader>
        <Button variant="destructive" onClick={handleDelete}>
          确定删除
        </Button>
      </DialogContent>
    </Dialog>
  );
}
