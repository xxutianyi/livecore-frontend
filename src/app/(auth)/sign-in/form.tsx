'use client';

import { TextField } from '@/components/fields';
import { useUserContext } from '@/components/provider/user-provider';
import { Button } from '@/components/shadcn/button';
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/shadcn/field';
import { useForm } from '@/components/winglab/form/use-form';
import { login } from '@/service/api/auth';
import { SiApple, SiWechat } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function SignInForm({ redirectTo }: { redirectTo: string }) {
    const router = useRouter();
    const userContext = useUserContext();

    const form = useForm({
        onSubmit: async (values) => {
            try {
                const user = await login(values);
                userContext?.setUser(user);
                router.push(redirectTo);
            } catch (errors: any) {
                form.setFormErrors(errors);
            }
        },
    });

    return (
        <form className="p-6 md:p-8" onSubmit={form.handleSubmit}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">登录账号</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        使用用户名/邮箱/手机号登录
                    </p>
                </div>

                <TextField name="username" label="账号" formApi={form} />
                <TextField name="password" label="密码" formApi={form} />

                <Field>
                    <Button type="submit">登录</Button>
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
