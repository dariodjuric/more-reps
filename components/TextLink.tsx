import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

interface Props {
  href?: string;
  children: string;
  onClick?: () => void;
  color?: string;
}

export const TextLink = ({ children, href, onClick, color }: Props) => (
  <NextLink href={href || ''} legacyBehavior passHref>
    <Link color={color || 'teal.500'} onClick={onClick}>
      {children}
    </Link>
  </NextLink>
);
