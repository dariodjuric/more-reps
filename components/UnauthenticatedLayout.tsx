import { Container, Heading, Image, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const UnauthenticatedLayout = ({ children }: Props) => {
  return (
    <Container mt="10" h="full">
      <VStack spacing={25}>
        <VStack w="full">
          <Image boxSize="30%" src="more-reps-logo.svg" alt="More Reps" />
          <Heading as="h1">More Reps</Heading>
        </VStack>
        {children}
      </VStack>
    </Container>
  );
};

export default UnauthenticatedLayout;
