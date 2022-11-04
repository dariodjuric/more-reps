import { NextPageWithLayout } from './_app';
import { Link } from '@chakra-ui/react';
import { ReactElement } from 'react';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { useUser } from '../lib/useUser';
import { useRouter } from 'next/router';
import fetchJson from '../lib/fetchJson';

const MyProfile: NextPageWithLayout = () => {
  const { mutateUser } = useUser();
  const router = useRouter();

  // @ts-ignore
  return (
    <>
      <Link
        onClick={async (e) => {
          e.preventDefault();
          mutateUser(await fetchJson('/api/logout', { method: 'POST' }), false);
          router.push('/sign-in');
        }}
      >
        Log out
      </Link>
    </>
  );
};

MyProfile.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticatedLayout title="My MyProfile">{page}</AuthenticatedLayout>;
};

export default MyProfile;
