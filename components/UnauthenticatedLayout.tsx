import { Container, Heading, Image, Link, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import NextLink from 'next/link';

interface Props {
  children: ReactNode;
}

const UnauthenticatedLayout = ({ children }: Props) => {
  return (
    <Container mt="10" h="full">
      <VStack spacing={25}>
        <VStack w="full">
          <NextLink href="/" passHref>
            <Link>
              <Image boxSize="150" src="more-reps-logo.svg" alt="More Reps" />
            </Link>
          </NextLink>

          <Heading as="h1">More Reps</Heading>
        </VStack>
        {children}
      </VStack>
    </Container>
  );
};

export default UnauthenticatedLayout;
