import { Box, Link, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import UnauthenticatedLayout from '../components/UnauthenticatedLayout';
import SignInForm from '../components/sign-in/SignInForm';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Stack>
        <Text>
          More Reps is a simple fitness tracker, helping you track your progress
          and get that extra rep in your workouts. It is completely free to use.
        </Text>
        <Text>
          Don’t have an account?{' '}
          <NextLink href="/sign-up" passHref>
            <Link>Sign up</Link>
          </NextLink>
          .
        </Text>
      </Stack>
      <Box w="full">
        <SignInForm></SignInForm>
      </Box>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default Home;
