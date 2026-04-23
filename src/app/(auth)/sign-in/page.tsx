import { SignInForm } from '@/app/(auth)/sign-in/form';

type SearchParams = Promise<{ redirect?: string }>;

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
    const { redirect } = await searchParams;

    return <SignInForm redirectTo={redirect} />;
}
