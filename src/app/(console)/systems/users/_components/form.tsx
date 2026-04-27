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
import { settingsAdminsStore } from '@/service/requests';
import { Form, SelectField, TextField } from '@winglab/react-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserCreate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
        <Form
          onSubmit={async (values) => {
            const user = await settingsAdminsStore(values);
            setOpen(false);
            toast.success('保存成功');
            router.push('/systems/users/' + user?.id);
          }}
        >
          <FieldGroup>
            <TextField name="name" label="姓名" />
            <TextField name="phone" label="手机号" />
            <TextField name="email" label="电子邮件" />
            <SelectField
              name="role"
              label="用户角色"
              options={[
                { label: '系统管理员', value: 'admin' },
                { label: '直播管理员', value: 'room-admin' },
              ]}
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
