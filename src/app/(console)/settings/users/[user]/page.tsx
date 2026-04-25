import { Onlines } from '@/app/(console)/settings/users/[user]/_components/onlines';
import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { usersShow } from '@/service/api/settings';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserDetails } from './_components/details';
import { MessageTable } from './_components/message';

type Props = { params: Promise<{ user: string }> };

export const metadata: Metadata = {
  title: '观众信息',
};

export default async function UserPage({ params }: Props) {
  const user = await usersShow((await params).user);
  if (!user) notFound();

  return (
    <PageContainer
      title="观众信息"
      breadcrumb={[
        { label: '观众管理', link: '/settings/users' },
        { label: '观众信息', link: `/settings/users/${user.id}` },
        { label: `${user.name}`, link: `/settings/users/${user.id}` },
      ]}
    >
      <Separator />
      <UserDetails user={user} />
      <Separator />
      <Onlines onlines={user.onlines} />
      <Separator />
      <MessageTable messages={user.messages} />
    </PageContainer>
  );
}
