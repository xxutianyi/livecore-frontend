import { ProfileForm } from '@/app/(website)/profile/form';
import { PageContent } from '@/components/container';
import { Separator } from '@/components/shadcn/separator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '账号信息',
};

export default function ProfilePage() {
  return (
    <PageContent title="账号设置">
      <Separator />
      <ProfileForm />
    </PageContent>
  );
}
