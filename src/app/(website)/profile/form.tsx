'use client';

import { TextField } from '@/components/fields';
import { Section, SectionTitle } from '@/components/layout';
import { useUserContext } from '@/components/provider/user-provider';
import { Button } from '@/components/shadcn/button';
import { FieldGroup } from '@/components/shadcn/field';
import { Separator } from '@/components/shadcn/separator';
import { useForm } from '@/components/winglab/form/use-form';
import { cn } from '@/lib/utils';
import { passwordUpdate, profileUpdate } from '@/service/api/auth';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentProps, ReactNode, useState } from 'react';
import { toast } from 'sonner';

export function ProfileForm() {
    const [section, setSection] = useState<'account' | 'password'>('account');

    const AccountButton = (props: ComponentProps<typeof Button>) => (
        <Button
            variant="secondary"
            className="md:hidden"
            onClick={() => setSection('account')}
            {...props}
        >
            <User /> 基本信息
        </Button>
    );
    const PasswordButton = (props: ComponentProps<typeof Button>) => (
        <Button
            variant="secondary"
            className="md:hidden"
            onClick={() => setSection('password')}
            {...props}
        >
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
                            section === 'account'
                                ? 'bg-muted hover:bg-accent'
                                : 'hover:bg-accent hover:underline',
                        )}
                    />
                    <PasswordButton
                        size="lg"
                        variant="ghost"
                        className={cn(
                            'justify-start',
                            section === 'password'
                                ? 'bg-muted hover:bg-accent'
                                : 'hover:bg-accent hover:underline',
                        )}
                    />
                </nav>
                <div className="w-full">
                    {section === 'account' && <UpdateProfile action={<PasswordButton />} />}
                    {section === 'password' && <UpdatePassword action={<AccountButton />} />}
                </div>
            </div>
        </>
    );
}

export function UpdateProfile({ action }: { action: ReactNode }) {
    const router = useRouter();
    const userContext = useUserContext();

    const form = useForm({
        initialValues: userContext?.user,
        onSubmit: async (values) => {
            try {
                const user = await profileUpdate(values);
                userContext?.setUser(user);
                toast.success('保存成功');
                router.refresh();
            } catch (errors: any) {
                form.setFormErrors(errors);
            }
        },
    });

    return (
        <Section title={<SectionTitle title="基本信息" actions={[action]} />}>
            <Separator />
            <form className="w-full max-w-lg space-y-6" onSubmit={(e) => form.handleSubmit(e)}>
                <FieldGroup>
                    <TextField name="name" label="名字" formApi={form} />
                    <TextField name="phone" label="手机号" formApi={form} />
                    <TextField name="email" label="电子邮箱" formApi={form} />
                </FieldGroup>

                <Button type="submit" size="lg">
                    保存修改
                </Button>
            </form>
        </Section>
    );
}

export function UpdatePassword({ action }: { action: ReactNode }) {
    const form = useForm({
        onSubmit: async (values) => {
            try {
                await passwordUpdate(values);
                toast.success('保存成功');
            } catch (errors: any) {
                form.setFormErrors(errors);
            }
        },
    });

    return (
        <Section title={<SectionTitle title="修改密码" actions={[action]} />}>
            <Separator />
            <form className="w-full max-w-lg space-y-6" onSubmit={form.handleSubmit}>
                <FieldGroup>
                    <TextField name="current_password" label="当前密码" formApi={form} />
                    <TextField name="password" label="新密码" formApi={form} />
                    <TextField name="password_confirmation" label="再次输入新密码" formApi={form} />
                </FieldGroup>

                <Button type="submit" size="lg">
                    保存修改
                </Button>
            </form>
        </Section>
    );
}
