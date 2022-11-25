import { NextPageWithLayout } from '../_app';
import { ReactElement, useState } from 'react';
import { Button, HStack, Text } from '@chakra-ui/react';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import useSWR from 'swr';
import { fetcher } from '../../lib/fetcher';
import {
  ExerciseData,
  WorkoutData,
  WorkoutResponse,
} from '../api/workouts/[workoutId]';
import { useRouter } from 'next/router';
import { ExerciseList } from '../../components/ExerciseList';

const Workout: NextPageWithLayout = () => {
  const router = useRouter();
  const { workoutId } = router.query;
  const { data, mutate, error } = useSWR<WorkoutResponse>(
    `/api/workouts/${workoutId}`,
    fetcher
  );
  const [updatedWorkout, setUpdatedWorkout] = useState<WorkoutData | null>(
    null
  );

  if (!workoutId) {
    throw Error('No workout ID');
  }

  const handleUpdateWorkout = (updatedExercises: ExerciseData[]) => {
    if (data?.workout) {
      const workoutCopy = updatedWorkout
        ? structuredClone(updatedWorkout)
        : structuredClone(data.workout);

      workoutCopy.exercises = updatedExercises;
      setUpdatedWorkout(workoutCopy);
    }
  };

  const handleSaveWorkout = async () => {
    if (updatedWorkout) {
      await mutate(
        fetcher(`/api/workouts/${workoutId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedWorkout),
        })
      );
    }
  };

  const handleRemoveWorkout = async () => {
    await mutate(
      fetcher(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
      }),
      { revalidate: false, populateCache: false }
    );
    await router.push('/');
  };

  if (error) {
    return <Text>Error loading workout.</Text>;
  }

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <ExerciseList
        initialExercises={data.workout.exercises}
        onUpdate={handleUpdateWorkout}
      />
      <HStack pt="12" w="full" justifyContent="space-between">
        <Button colorScheme="red" variant="ghost" onClick={handleRemoveWorkout}>
          Remove workout
        </Button>
        <Button onClick={handleSaveWorkout}>Save workout</Button>
      </HStack>
    </>
  );
};

Workout.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticatedLayout title="My workout">{page}</AuthenticatedLayout>;
};

export default Workout;
