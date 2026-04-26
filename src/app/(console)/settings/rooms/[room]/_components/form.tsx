'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { UploadField } from '@/components/uploader';
import { coverUpdate, roomsApi } from '@/service/api/settings';
import { LiveRoom } from '@/service/model';
import { Form, TextareaField, TextField } from '@winglab/react-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function RoomUpdate({ room }: { room: LiveRoom }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>编辑直播间</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑直播间</DialogTitle>
        </DialogHeader>
        <Form
          initialValues={room}
          onSubmit={async (values) => {
            await roomsApi.update(room.id, values);
            setOpen(false);
            toast.success('保存成功');
            router.refresh();
          }}
        >
          <FieldGroup>
            <TextField name="name" label="名称" />
            <TextareaField name="description" label="简介" />
            <Field>
              <Button type="submit">保存</Button>
            </Field>
          </FieldGroup>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function CoverUpdate({ room }: { room: LiveRoom }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>更新封面</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>更新封面</DialogTitle>
        </DialogHeader>
        <Form
          onSubmit={async (values) => {
            await coverUpdate(room.id, values);
            setOpen(false);
            toast.success('保存成功');
            router.refresh();
          }}
        >
          <FieldGroup>
            <UploadField name="cover" label="封面" accept={['image/*']} />
            <Field>
              <Button type="submit">保存</Button>
            </Field>
          </FieldGroup>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
