import { VStack, Text, Link, Image } from '@chakra-ui/react';
import NextLink from 'next/link';

interface Props {
  label: string;
  linkTo: string;
  icon: string;
}

const MenuOption = ({ label, icon, linkTo }: Props) => {
  return (
    <NextLink legacyBehavior href={linkTo} passHref>
      <Link>
        <VStack spacing="0">
          <Image boxSize="8" src={`/menu/${icon}.svg`} alt={label} />
          <Text fontSize="xs">{label}</Text>
        </VStack>
      </Link>
    </NextLink>
  );
};

export default MenuOption;
