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
import { groupsApi, usersApi } from '@/service/api/settings';
import { Form, MutiSelectField, TextField } from '@winglab/react-form';
import { useState } from 'react';
import useSWR from 'swr';

export function UserCreate() {
  const [open, setOpen] = useState(false);
  const { data: groups } = useSWR('/api/settings/groups', () => groupsApi.index());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>新建用户</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建用户</DialogTitle>
          <DialogDescription>默认密码 Password!@ ，请提示用户修改</DialogDescription>
        </DialogHeader>
        <Form onSubmit={usersApi.store}>
          <FieldGroup>
            <TextField name="name" label="姓名" />
            <TextField name="phone" label="手机号" />
            <TextField name="email" label="电子邮件" />
            <TextField name="invitation_code" label="邀请人代码" />
            <MutiSelectField
              label="分组"
              name="group_ids"
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
