import { NextPageWithLayout } from '../_app';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FormEvent, ReactElement, useState } from 'react';
import UnauthenticatedLayout from '../../components/UnauthenticatedLayout';
import { ErrorMessage } from '../../components/ErrorMessage';
import { TextLink } from '../../components/TextLink';

const ResetPassword: NextPageWithLayout = () => {
  const [email, setEmail] = useState('');
  const [isError, setIsError] = useState(false);
  const [view, setView] = useState<'initial' | 'confirmation'>('initial');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        '/api/password-reset/send-confirmation-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );
      if (response.ok) {
        setIsError(false);
        setView('confirmation');
      } else {
        setIsError(true);
      }
    } catch (e) {
      console.error(e);
      setIsError(true);
    }
  };

  if (view === 'confirmation') {
    return (
      <Text>
        Thanks, check your email for instructions to reset your password. If you
        do not receive anything within 5 minutes, you can{' '}
        <Link onClick={() => setView('initial')}>try again</Link>.
      </Text>
    );
  }

  return (
    <>
      <Stack>
        <Text>
          If you’d like to reset your password, you can do so here by entering
          the email associated with your account below, and we will send you a
          link to reset your password.
        </Text>
        <Text>
          Otherwise, you can <TextLink href="/">sign in</TextLink> or{' '}
          <TextLink href="/signup">create a new account</TextLink>.
        </Text>
      </Stack>
      <Box w="full">
        {view === 'initial' && (
          <form onSubmit={handleSubmit}>
            <VStack>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </FormControl>
              <Button type="submit">Send reset instructions</Button>
              {isError && (
                <ErrorMessage>
                  There was a problem processing this request.
                </ErrorMessage>
              )}
            </VStack>
          </form>
        )}
      </Box>
    </>
  );
};

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default ResetPassword;
