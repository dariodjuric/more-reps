import { Box, Stack, Text } from '@chakra-ui/react';
import { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import UnauthenticatedLayout from '../components/UnauthenticatedLayout';
import SignInForm from '../components/sign-in/SignInForm';
import { TextLink } from '../components/TextLink';

const SignIn: NextPageWithLayout = () => {
  return (
    <>
      <Stack>
        <Text>
          More Reps is a simple fitness tracker, helping you track your progress
          and get that extra rep in your workouts. It is completely free to use.
        </Text>
        <Text>
          Don’t have an account? <TextLink href="/signup">Sign up</TextLink>.
        </Text>
      </Stack>
      <Box w="full">
        <SignInForm></SignInForm>
      </Box>
    </>
  );
};

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default SignIn;
