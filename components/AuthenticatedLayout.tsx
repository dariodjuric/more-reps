import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Link,
  VStack,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import NextLink from 'next/link';
import MenuOption from './MenuOption';

interface Props {
  children: ReactNode;
  title: string;
}

const AuthenticatedLayout = ({ children, title }: Props) => {
  return (
    <VStack h="full">
      <Box flexGrow="1" overflowY="auto" w="100vw">
        <Container>
          <VStack w="full" mb="25">
            <NextLink href="/" passHref>
              <Link>
                <Image boxSize="90" src="more-reps-logo.svg" alt="More Reps" />
              </Link>
            </NextLink>

            <Heading as="h1">{title}</Heading>
          </VStack>
          <VStack>{children}</VStack>
        </Container>
      </Box>

      <HStack
        height="16"
        width="full"
        justifyContent="center"
        spacing="30"
        borderTop="1px"
        borderColor="gray.200"
      >
        <MenuOption label="Home" linkTo="/past-workouts" icon="home" />
        <MenuOption
          label="My Templates"
          linkTo="/past-templates"
          icon="templates"
        />
        <MenuOption
          label="New Workout"
          linkTo="/new-workout"
          icon="new-workout"
        />
        <MenuOption label="My Profile" linkTo="/my-profile" icon="my-profile" />
      </HStack>
    </VStack>
  );
};

export default AuthenticatedLayout;
