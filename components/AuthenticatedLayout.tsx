import {
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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface Props {
  children: ReactNode;
  title: string;
}

const AuthenticatedLayout = ({ children, title }: Props) => {
  const router = useRouter();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/signin');
    },
  });

  if (status === 'loading') {
    return null;
  }

  return (
    <>
      <Container pb="100px">
        <VStack w="full" mb="25">
          <NextLink legacyBehavior href="/" passHref>
            <Link>
              <Image boxSize="90" src="/more-reps-logo.svg" alt="More Reps" />
            </Link>
          </NextLink>

          <Heading as="h1">{title}</Heading>
        </VStack>
        <VStack>{children}</VStack>
      </Container>

      <HStack
        position="fixed"
        bottom="0"
        height="60px"
        width="full"
        justifyContent="center"
        spacing="30"
        borderTop="1px"
        borderColor="gray.200"
        padding={[10, 5]}
        backgroundColor="white"
      >
        <MenuOption label="Home" linkTo="/" icon="home" />
        <MenuOption
          label="New workout"
          linkTo="/new-workout"
          icon="new-workout"
        />
        <MenuOption label="My profile" linkTo="/my-profile" icon="my-profile" />
      </HStack>
    </>
  );
};

export default AuthenticatedLayout;
