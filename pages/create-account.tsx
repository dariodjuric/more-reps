import { NextPageWithLayout } from './_app';
import {
  Button,
  FormControl,
  FormHelperText,
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

const CreateAccount: NextPageWithLayout = () => {
  return (
    <>
      <Stack w="full">
        <Text>
          Already have an account?{' '}
          <NextLink href="/" passHref>
            <Link>Sign in</Link>
          </NextLink>
          .
        </Text>
      </Stack>
      <VStack w="full" spacing="5">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input type="text" autoComplete="off" />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" autoComplete="off" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" autoComplete="off" />
          <FormHelperText>At least 8 characters long</FormHelperText>
        </FormControl>
        <Button type="submit">Create Account</Button>
      </VStack>
    </>
  );
};

CreateAccount.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default CreateAccount;
