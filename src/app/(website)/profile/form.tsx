'use client';

import { Section, SectionTitle } from '@/components/container';
import { useAuth } from '@/components/provider/auth-provider';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { passwordUpdate, profileUpdate } from '@/service/requests';
import { Form, PasswordField, TextField } from '@winglab/react-form';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentProps, ReactNode, useState } from 'react';
import { toast } from 'sonner';

export function ProfileForm() {
  const [section, setSection] = useState<'account' | 'password'>('account');

  const AccountButton = (props: ComponentProps<typeof Button>) => (
    <Button variant="secondary" className="md:hidden" onClick={() => setSection('account')} {...props}>
      <User /> 基本信息
    </Button>
  );
  const PasswordButton = (props: ComponentProps<typeof Button>) => (
    <Button variant="secondary" className="md:hidden" onClick={() => setSection('password')} {...props}>
      <Lock /> 修改密码
    </Button>
  );

  return (
    <>
      <div className="mx-auto flex w-full space-x-12">
        <nav className="hidden w-full max-w-1/5 flex-col space-y-1 md:flex">
          <AccountButton
            size="lg"
            variant="ghost"
            className={cn(
              'justify-start',
              section === 'account' ? 'bg-muted hover:bg-accent' : 'hover:bg-accent hover:underline'
            )}
          />
          <PasswordButton
            size="lg"
            variant="ghost"
            className={cn(
              'justify-start',
              section === 'password' ? 'bg-muted hover:bg-accent' : 'hover:bg-accent hover:underline'
            )}
          />
        </nav>
        <div className="w-full">
          {section === 'account' && <UpdateProfile action={<PasswordButton key="account" />} />}
          {section === 'password' && <UpdatePassword action={<AccountButton key="password" />} />}
        </div>
      </div>
    </>
  );
}

export function UpdateProfile({ action }: { action: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  return (
    <Section title={<SectionTitle title="基本信息" actions={[action]} />}>
      <Separator />
      <Form
        className="w-full max-w-lg space-y-6"
        initialValues={auth?.data}
        onSubmit={async (values) => {
          const user = await profileUpdate(values);
          auth?.mutate(user);
          toast.success('保存成功');
          router.refresh();
        }}
      >
        <FieldGroup>
          <TextField name="name" label="名字" />
          <TextField name="phone" label="手机号" />
          <TextField name="email" label="电子邮箱" />
        </FieldGroup>

        <Button type="submit" size="lg">
          保存修改
        </Button>
      </Form>
    </Section>
  );
}

export function UpdatePassword({ action }: { action: ReactNode }) {
  return (
    <Section title={<SectionTitle title="修改密码" actions={[action]} />}>
      <Separator />
      <Form
        className="w-full max-w-lg space-y-6"
        onSubmit={async (values) => {
          await passwordUpdate(values);
          toast.success('保存成功');
        }}
      >
        <FieldGroup>
          <PasswordField name="current_password" label="当前密码" />
          <PasswordField name="password" label="新密码" />
          <PasswordField name="password_confirmation" label="再次输入" />
        </FieldGroup>

        <Button type="submit" size="lg">
          保存修改
        </Button>
      </Form>
    </Section>
  );
}
