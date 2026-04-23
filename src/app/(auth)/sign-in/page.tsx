import { SignInForm } from '@/app/(auth)/sign-in/form';

type SearchParams = Promise<{ redirectTo?: string }>;

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
    const { redirectTo } = await searchParams;

    return <SignInForm redirectTo={redirectTo ?? '/'} />;
}
