import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { audienceUsersApi } from '@/service/requests';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserDetails } from './_components/details';
import { MessageTable } from './_components/message';
import { Onlines } from './_components/onlines';

type Props = { params: Promise<{ user: string }> };

export const metadata: Metadata = {
  title: '观众信息',
};

export default async function UserPage({ params }: Props) {
  const user = await audienceUsersApi.show((await params).user);
  if (!user) notFound();

  return (
    <PageContainer
      title="观众信息"
      breadcrumb={[
        { label: '观众管理', link: '/settings/users' },
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
