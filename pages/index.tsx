import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import UnauthenticatedLayout from "../components/UnauthenticatedLayout";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Stack>
        <Text>
          More Reps is a simple fitness tracker, helping you track your progress
          and get that extra rep in your workouts. It is completely free to use.
        </Text>
        <Text>
          Don’t have an account?{" "}
          <NextLink href="/create-account" passHref>
            <Link>Sign up</Link>
          </NextLink>
          .
        </Text>
      </Stack>
      <VStack w="full">
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <HStack w="full" justifyContent="space-between">
          <Checkbox defaultChecked>Remember me</Checkbox>
          <Text>
            <NextLink href="/reset-password" passHref>
              <Link>Forgot password?</Link>
            </NextLink>
          </Text>
        </HStack>
        <Button type="submit">Sign In</Button>
      </VStack>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default Home;
