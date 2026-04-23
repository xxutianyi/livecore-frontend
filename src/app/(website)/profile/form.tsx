'use client';

import { TextField } from '@/components/fields';
import { Section } from '@/components/layout';
import { useUserContext } from '@/components/provider/user-provider';
import { Button } from '@/components/shadcn/button';
import { FieldGroup } from '@/components/shadcn/field';
import { Separator } from '@/components/shadcn/separator';
import { cn } from '@/lib/utils';
import { profileUpdate } from '@/service/api/auth';
import { useForm } from '@tanstack/react-form';
import { Lock, User } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

export function ProfileForm() {
    const [section, setSection] = useState<'account' | 'password'>('account');

    return (
        <div className="mx-auto flex w-full max-w-5xl space-x-12">
            <nav className="flex w-full max-w-1/5 flex-col space-y-1">
                <Button
                    size="lg"
                    variant="ghost"
                    className={cn(
                        'justify-start',
                        section === 'account'
                            ? 'bg-muted hover:bg-accent'
                            : 'hover:bg-accent hover:underline',
                    )}
                    onClick={() => setSection('account')}
                >
                    <User /> 基本信息
                </Button>
                <Button
                    size="lg"
                    variant="ghost"
                    className={cn(
                        'justify-start',
                        section === 'password'
                            ? 'bg-muted hover:bg-accent'
                            : 'hover:bg-accent hover:underline',
                    )}
                    onClick={() => setSection('password')}
                >
                    <Lock /> 修改密码
                </Button>
            </nav>
            <div className="w-full">{section === 'account' && <UpdateProfile />}</div>
        </div>
    );
}

const profileSchema = z.object({
    name: z.string({ error: '请输入名字' }),
    phone: z.string({ error: '请输入手机号' }).nullable(),
    email: z.email({ error: '请输入有效邮箱' }).nullable(),
});

export function UpdateProfile() {
    const user = useUserContext();
    const form = useForm({
        defaultValues: {
            name: user?.name,
            phone: user?.phone ?? null,
            email: user?.email ?? null,
        },
        validators: {
            onSubmit: profileSchema,
            onSubmitAsync: ({ value }) => profileUpdate(value),
        },
    });

    return (
        <Section title="基本信息">
            <Separator />
            <form
                className="w-full max-w-lg space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <FieldGroup>
                    <form.Field name="name">
                        {(fieldApi) => <TextField label="名字" fieldApi={fieldApi} />}
                    </form.Field>
                    <form.Field name="phone">
                        {(fieldApi) => <TextField label="手机号" fieldApi={fieldApi} />}
                    </form.Field>
                    <form.Field name="email">
                        {(fieldApi) => (
                            <TextField type="email" label="电子邮箱" fieldApi={fieldApi} />
                        )}
                    </form.Field>
                </FieldGroup>

                <form.Subscribe selector={(state) => state.canSubmit}>
                    {(canSubmit) => (
                        <Button type="submit" size="lg" disabled={!canSubmit}>
                            保存修改
                        </Button>
                    )}
                </form.Subscribe>
            </form>
        </Section>
    );
}
