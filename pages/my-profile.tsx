import { NextPageWithLayout } from './_app';
import { Button, Text, VStack } from '@chakra-ui/react';
import { ReactElement } from 'react';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { signOut, useSession } from 'next-auth/react';

const MyProfile: NextPageWithLayout = () => {
  const { data } = useSession();

  // @ts-ignore
  return (
    <VStack spacing="4">
      <Text>
        You are currently logged in as <Text as="b">{data?.user?.email}</Text>.
      </Text>
      <Button onClick={() => signOut({ redirect: true })}>Log out</Button>
    </VStack>
  );
};

MyProfile.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticatedLayout title="My profile">{page}</AuthenticatedLayout>;
};

export default MyProfile;
