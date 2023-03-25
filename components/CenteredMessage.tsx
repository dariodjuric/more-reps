import { Center } from '@chakra-ui/react';

interface Props {
  children?: string;
}

export const CenteredMessage = ({ children }: Props) => {
  return <Center height="100%">{children ? children : 'Loading...'}</Center>;
};
