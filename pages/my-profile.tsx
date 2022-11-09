import { NextPageWithLayout } from './_app';
import { Link } from '@chakra-ui/react';
import { ReactElement } from 'react';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { signOut } from 'next-auth/react';

const MyProfile: NextPageWithLayout = () => {
  // @ts-ignore
  return (
    <>
      <Link onClick={() => signOut({ redirect: true })}>Log out</Link>
    </>
  );
};

MyProfile.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticatedLayout title="My Profile">{page}</AuthenticatedLayout>;
};

export default MyProfile;
