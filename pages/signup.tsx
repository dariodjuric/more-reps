import { NextPageWithLayout } from './_app';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FormEvent, ReactElement, useState } from 'react';
import UnauthenticatedLayout from '../components/UnauthenticatedLayout';
import { useRouter } from 'next/router';
import { ErrorMessage } from '../components/ErrorMessage';
import { TextLink } from '../components/TextLink';
import * as Sentry from '@sentry/nextjs';

const SignUp: NextPageWithLayout = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        await router.push('/signin');
        setIsError(false);
      } else {
        setIsError(true);
      }
    } catch (e) {
      Sentry.captureException(e);
      console.error(e);
      setIsError(true);
    }
  };

  return (
    <Stack w="full" spacing={6}>
      <Text>
        You can create a new More Reps account by filling out the following
        form. Already have an account? <TextLink href="/">Sign in</TextLink>.
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack w="full" spacing="5">
          <FormControl isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              autoComplete="off"
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <FormHelperText>At least 8 characters long</FormHelperText>
          </FormControl>
          <Button type="submit">Create account</Button>
          {isError && (
            <ErrorMessage>
              There was a problem creating your account.
            </ErrorMessage>
          )}
        </VStack>
      </form>
    </Stack>
  );
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default SignUp;
