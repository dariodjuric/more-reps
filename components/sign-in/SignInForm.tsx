import {
  Button,
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
import { signIn } from 'next-auth/react';
import { ErrorMessage } from '../ErrorMessage';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signIn('credentials', { email, password });
      setIsError(false);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack w="full">
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            name="username"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </FormControl>
        <HStack w="full" justifyContent="end">
          <Text>
            <NextLink legacyBehavior href="/password-reset" passHref>
              <Link>Forgot password?</Link>
            </NextLink>
          </Text>
        </HStack>
        <Button type="submit">Sign in</Button>
        {isError && (
          <ErrorMessage>There was a problem logging in.</ErrorMessage>
        )}
      </VStack>
    </form>
  );
};

export default SignInForm;
