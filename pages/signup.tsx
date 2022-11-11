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
import { FormEvent, ReactElement, useState } from 'react';
import UnauthenticatedLayout from '../components/UnauthenticatedLayout';
import { useRouter } from 'next/router';

const SignUp: NextPageWithLayout = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      await router.push('/signin');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            autoComplete="off"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <FormHelperText>At least 8 characters long</FormHelperText>
        </FormControl>
        <Button type="submit">Create Account</Button>
      </VStack>
    </form>
  );
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default SignUp;
