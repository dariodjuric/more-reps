import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

export const ErrorMessage = ({ children }: { children: string }) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
