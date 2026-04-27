import { UserDelete, UserUpdate } from '@/app/(console)/systems/users/[user]/_components/form';
import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { settingsAdminsShow } from '@/service/requests';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserDetails } from './_components/details';
import { RoomIndex, RoomUpdate } from './_components/rooms';

type Props = { params: Promise<{ user: string }> };

export const metadata: Metadata = {
  title: '观众信息',
};

export default async function UserPage({ params }: Props) {
  const user = await settingsAdminsShow((await params).user);
  if (!user) notFound();

  return (
    <PageContainer
      title="管理员信息"
      breadcrumb={[
        { label: '管理员', link: '/systems/users' },
        { label: `${user.name}`, link: `/systems/users/${user.id}` },
      ]}
      actions={[
        <UserUpdate user={user} key="user-update" />,
        <RoomUpdate user={user} key="manageable" />,
        <UserDelete user={user} key="user-delete" />,
      ]}
    >
      <Separator />
      <UserDetails user={user} />
      <Separator />
      <RoomIndex user={user} />
    </PageContainer>
  );
}
