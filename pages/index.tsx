import { NextPageWithLayout } from './_app';
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  VStack,
  Text,
} from '@chakra-ui/react';
import { ReactElement } from 'react';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';
import { WorkoutListItem, WorkoutListResponse } from './api/workouts';
import { TextLink } from '../components/TextLink';
import { format } from 'date-fns';

const formatWorkoutTitle = (workout: WorkoutListItem) => {
  const workoutDate = new Date(workout.finishedAt);
  return `Workout from ${format(workoutDate, 'PPPP')}`;
};

const PastWorkouts: NextPageWithLayout = () => {
  const { data } = useSWR<WorkoutListResponse>('/api/workouts/', fetcher);

  return (
    <>
      <TableContainer w="full">
        <Table variant="simple">
          <Tbody>
            {data?.workouts.map((workout) => (
              <Tr key={workout.id}>
                <Td>
                  <VStack alignItems="flex-start">
                    <TextLink href={`/workouts/${workout.id}`}>
                      <Text>{formatWorkoutTitle(workout)}</Text>
                    </TextLink>
                    <Text color="gray.500">
                      {workout.exerciseCount} exercises
                    </Text>
                  </VStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

PastWorkouts.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthenticatedLayout title="Past workouts">{page}</AuthenticatedLayout>
  );
};

export default PastWorkouts;
