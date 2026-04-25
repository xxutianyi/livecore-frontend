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
import { Form, TextField } from '@winglab/react-form';
import { ColumnsDef, DataTable } from '@winglab/react-table';
import { useState } from 'react';

export function GroupIndex() {
  const options = useOptions();

  const columns = ColumnsDef<UserGroup>([
    {
      dataKey: 'name',
      title: '名字',
    },
    {
      index: 'actions',
      tableRowRender: (data) => (
        <div className="w-5">
          <GroupUpdate group={data} />
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
        <DataTable columns={columns} data={options.groups} />
      </DialogContent>
    </Dialog>
  );
}

export function GroupCreate() {
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
        <Form>
          <FieldGroup>
            <TextField name="name" label="名称" />
            <Field>
              <Button type="submit">保存</Button>
            </Field>
          </FieldGroup>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function GroupUpdate({ group }: { group?: UserGroup }) {
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
        <Form initialValues={group}>
          <FieldGroup>
            <TextField name="name" label="名称" />
            <Field>
              <Button type="submit">保存</Button>
            </Field>
          </FieldGroup>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
