import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FormEvent, useState } from 'react';
import fetchJson, { FetchError } from '../../lib/fetchJson';
import { useUser } from '../../lib/useUser';
import { LoginRequest } from '../../pages/api/login';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { mutateUser } = useUser({
    redirectTo: '/past-workouts',
    redirectIfLoggedIn: true,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      mutateUser(
        await fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password } as LoginRequest),
        })
      );
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error);
        setErrorMessage(error.data.message);
      } else {
        console.error('An unexpected error happened:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack w="full">
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </FormControl>
        <HStack w="full" justifyContent="space-between">
          <Checkbox defaultChecked>Remember me</Checkbox>
          <Text>
            <NextLink href="/reset-password" passHref>
              <Link>Forgot password?</Link>
            </NextLink>
          </Text>
        </HStack>
        <Button type="submit">Sign In</Button>
      </VStack>
    </form>
  );
};

export default SignInForm;
