import {
  Box,
  Container,
  Heading,
  Image,
  Link,
  VStack,
  Text,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import NextLink from 'next/link';
import { TextLink } from './TextLink';

interface Props {
  children: ReactNode;
}

const UnauthenticatedLayout = ({ children }: Props) => {
  return (
    <Container h="full">
      <VStack h="full">
        <VStack spacing={25} flexGrow="2">
          <VStack w="full" pt="25">
            <NextLink legacyBehavior href="/" passHref>
              <Link>
                <Image
                  boxSize="150"
                  src="/more-reps-logo.svg"
                  alt="More Reps"
                />
              </Link>
            </NextLink>

            <Heading as="h1">More Reps</Heading>
          </VStack>
          {children}
        </VStack>
        <Box pb="30" textAlign="center">
          <Text fontSize="xs">
            More Reps is an{' '}
            <TextLink href="https://github.com/dariodjuric/more-reps">
              open-source project
            </TextLink>{' '}
            by <TextLink href="https://darios.blog">Dario Djuric</TextLink>.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default UnauthenticatedLayout;
