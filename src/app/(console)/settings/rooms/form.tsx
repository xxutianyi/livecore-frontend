'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { roomsResource } from '@/service/api/settings';
import { Form, TextareaField, TextField, UploadField } from '@winglab/react-form';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { toast } from 'sonner';

export function RoomCreate() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>新建直播间</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建直播间</DialogTitle>
        </DialogHeader>
        <Form
          onSubmit={async (values) => {
            await roomsResource.store(values!);
            toast.success('保存成功');
          }}
        >
          <FieldGroup>
            <UploadField
              name="cover"
              label="封面"
              accept={['image/*']}
              preview={true}
              server={{
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
                headers: {
                  'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN') ?? '',
                },
                patch: { url: '/api/filepond?patch=', withCredentials: true },
                revert: { url: '/api/filepond', withCredentials: true },
                process: { url: '/api/filepond', withCredentials: true },
              }}
            />
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
