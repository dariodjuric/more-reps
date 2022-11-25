import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

interface Props {
  children: string;
}

export const ErrorMessage = ({ children }: Props) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
