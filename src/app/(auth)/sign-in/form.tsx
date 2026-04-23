'use client';

import { TextField } from '@/components/fields';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field';
import { toFormError } from '@/lib/validate';
import { getProfile, login } from '@/service/requests';
import { SiApple, SiWechat } from '@icons-pack/react-simple-icons';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { z } from 'zod';

const formSchema = z.object({
    username: z.string({ error: '请输入账号' }),
    password: z.string({ error: '请输入密码' }),
});

export function SignInForm() {
    getProfile();

    const form = useForm({
        canSubmitWhenInvalid: true,
        validators: {
            onSubmit: formSchema,
            onSubmitAsync: async ({ value }) => {
                try {
                    return await login(value);
                } catch (error) {
                    return toFormError(error);
                }
            },
        },
        onSubmit: async ({ value }) => {
            console.log(value);
        },
    });

    return (
        <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">登录账号</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        使用用户名/邮箱/手机号登录
                    </p>
                </div>
                <form.Field name="username">
                    {(fieldApi) => <TextField label="账号" fieldApi={fieldApi} />}
                </form.Field>
                <form.Field name="password">
                    {(fieldApi) => <TextField label="密码" fieldApi={fieldApi} />}
                </form.Field>

                <Field>
                    <form.Subscribe selector={(state) => state.canSubmit}>
                        {(canSubmit) => (
                            <Button type="submit" disabled={!canSubmit}>
                                登录
                            </Button>
                        )}
                    </form.Subscribe>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    其他登录方式
                </FieldSeparator>
                <Field className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button">
                        <SiApple />
                    </Button>
                    <Button variant="outline" type="button">
                        <SiWechat />
                    </Button>
                </Field>
                <FieldDescription className="text-center">
                    <Link href="/sign-up">没有账号，去注册</Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}
