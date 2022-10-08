import { VStack, Text, Link, Image } from "@chakra-ui/react";
import NextLink from "next/link";

interface Props {
  label: string;
  linkTo: string;
  icon: string;
}

const MenuOption = ({ label, icon }: Props) => {
  return (
    <NextLink href="/" passHref>
      <Link>
        <VStack spacing="0">
          <Image boxSize="30px" src={`menu/${icon}.svg`} alt={label} />
          <Text fontSize="xs">{label}</Text>
        </VStack>
      </Link>
    </NextLink>
  );
};

export default MenuOption;
