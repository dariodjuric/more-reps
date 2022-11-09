import { NextPageWithLayout } from './_app';
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { ReactElement } from 'react';
import AuthenticatedLayout from '../components/AuthenticatedLayout';

const PastWorkouts: NextPageWithLayout = () => {
  // @ts-ignore
  return (
    <>
      <TableContainer w="full">
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td>
                <VStack alignItems="flex-start">
                  <Text as="b">July 17, 2022</Text>
                  <Text color="gray.500">3 exercises</Text>
                </VStack>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <VStack alignItems="flex-start">
                  <Text as="b">July 1, 2022</Text>
                  <Text color="gray.500">5 exercises</Text>
                </VStack>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <VStack alignItems="flex-start">
                  <Text as="b">July 1, 2022</Text>
                  <Text color="gray.500">5 exercises</Text>
                </VStack>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <VStack alignItems="flex-start">
                  <Text as="b">July 1, 2022</Text>
                  <Text color="gray.500">5 exercises</Text>
                </VStack>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <VStack alignItems="flex-start">
                  <Text as="b">July 1, 2022</Text>
                  <Text color="gray.500">5 exercises</Text>
                </VStack>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <VStack alignItems="flex-start">
                  <Text as="b">July 1, 2022</Text>
                  <Text color="gray.500">5 exercises</Text>
                </VStack>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <VStack alignItems="flex-start">
                  <Text as="b">July 1, 2022</Text>
                  <Text color="gray.500">5 exercises</Text>
                </VStack>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

PastWorkouts.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthenticatedLayout title="Past Workouts">{page}</AuthenticatedLayout>
  );
};

export default PastWorkouts;
