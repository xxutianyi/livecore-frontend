'use client';

import { useAuth } from '@/components/provider/auth-provider';
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
import { User } from '@/service/model';
import { settingsAdminsDestroy, settingsAdminsUpdate } from '@/service/requests';
import { Form, SelectField, TextField } from '@winglab/react-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserUpdate({ user }: { user: User }) {
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>编辑用户</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑用户</DialogTitle>
        </DialogHeader>
        <Form
          initialValues={user}
          onSubmit={async (values) => {
            await settingsAdminsUpdate(user.id, values);
            setOpen(false);
            toast.success('保存成功');
            router.refresh();
          }}
        >
          <FieldGroup>
            <TextField name="name" label="姓名" />
            <TextField name="phone" label="手机号" />
            <TextField name="email" label="电子邮件" />
            {auth?.data?.id !== user.id && (
              <SelectField
                name="role"
                label="用户角色"
                options={[
                  { label: '系统管理员', value: 'admin' },
                  { label: '直播管理员', value: 'room-admin' },
                ]}
              />
            )}
            <Field>
              <Button type="submit">保存</Button>
            </Field>
          </FieldGroup>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function UserDelete({ user }: { user: User }) {
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (auth?.data?.id === user.id) return null;

  function handleDelete() {
    settingsAdminsDestroy(user.id).then(() => {
      setOpen(false);
      router.push('/systems/users');
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
          <DialogDescription>将同时删除用户相关的所有信息，且无法恢复</DialogDescription>
        </DialogHeader>
        <Button variant="destructive" onClick={handleDelete}>
          确定删除
        </Button>
      </DialogContent>
    </Dialog>
  );
}
