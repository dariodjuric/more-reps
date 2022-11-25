import { Text } from '@chakra-ui/react';

interface Props {
  children?: string;
}

export const LoadingMessage = ({ children }: Props) => {
  return <Text>{children ? children : 'Loading...'}</Text>;
};
