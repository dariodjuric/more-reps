import { NextPageWithLayout } from './_app';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { ReactElement } from 'react';
import UnauthenticatedLayout from '../components/UnauthenticatedLayout';

const ResetPassword: NextPageWithLayout = () => {
  return (
    <>
      <Stack>
        <Text>
          If you’d like to reset your password, you can do so here by entering
          your e-mail.
        </Text>
        <Text>
          Otherwise, you can{' '}
          <NextLink href="/" passHref>
            <Link>sign in</Link>
          </NextLink>{' '}
          or{' '}
          <NextLink href="/create-account" passHref>
            <Link>create a new account</Link>
          </NextLink>
          .
        </Text>
      </Stack>
      <VStack w="full" spacing="5">
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" autoComplete="off" />
        </FormControl>
        <Button type="submit">Send Reset Instructions</Button>
      </VStack>
    </>
  );
};

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default ResetPassword;
