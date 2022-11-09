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
import { signIn } from 'next-auth/react';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signIn('credentials', { email, password });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack w="full">
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            name="username"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </FormControl>
        <HStack w="full" justifyContent="space-between">
          <Checkbox defaultChecked>Remember me</Checkbox>
          <Text>
            <NextLink legacyBehavior href="/reset-password" passHref>
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
