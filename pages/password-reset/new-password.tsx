import { NextPageWithLayout } from '../_app';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { FormEvent, ReactElement, useState } from 'react';
import UnauthenticatedLayout from '../../components/UnauthenticatedLayout';
import { useRouter } from 'next/router';
import { ErrorMessage } from '../../components/ErrorMessage';
import * as Sentry from '@sentry/nextjs';

const NewPassword: NextPageWithLayout = () => {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const { token, id: userId } = router.query;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/password-reset/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: password,
          token,
          userId: Number(userId),
        }),
      });
      if (response.ok) {
        await router.push('/signin');
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
    <Box w="full">
      <form onSubmit={handleSubmit}>
        <VStack>
          <FormControl isRequired>
            <FormLabel>New password</FormLabel>
            <Input
              type="password"
              autoComplete="off"
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </FormControl>

          <Button type="submit">Change password</Button>
          {isError && (
            <ErrorMessage>
              There was a problem changing your password.
            </ErrorMessage>
          )}
        </VStack>
      </form>
    </Box>
  );
};

NewPassword.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default NewPassword;
