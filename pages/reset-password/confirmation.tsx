import { NextPageWithLayout } from '../_app';
import { Stack, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import UnauthenticatedLayout from '../../components/UnauthenticatedLayout';

const ResetConfirmation: NextPageWithLayout = () => {
  return (
    <Stack>
      <Text>
        An e-mail has been sent to your inbox. Please click the link when you
        get it.
      </Text>
    </Stack>
  );
};

ResetConfirmation.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default ResetConfirmation;
