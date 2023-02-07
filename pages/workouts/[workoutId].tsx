import { NextPageWithLayout } from '../_app';
import { ReactElement, useState } from 'react';
import { Button, HStack, Text } from '@chakra-ui/react';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import useSWR from 'swr';
import { fetcher } from '../../lib/fetcher';
import {
  ExercisePayload,
  WorkoutPayload,
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
  const [updatedWorkout, setUpdatedWorkout] = useState<WorkoutPayload | null>(
    null
  );
  const [isSaving, setSaving] = useState(false);
  const [hasPendingChanges, setPendingChanges] = useState(false);

  const handleUpdateWorkout = (updatedExercises: ExercisePayload[]) => {
    setPendingChanges(true);
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
      setSaving(true);
      await mutate(
        fetcher(`/api/workouts/${workoutId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedWorkout),
        })
      );
      setPendingChanges(false);
      setSaving(false);
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

  if (!data || !workoutId) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <ExerciseList
        initialExercises={data.workout.exercises}
        onUpdate={handleUpdateWorkout}
      />
      <HStack w="full" justifyContent="space-between">
        <Button colorScheme="red" variant="ghost" onClick={handleRemoveWorkout}>
          Remove workout
        </Button>
        <Button
          disabled={isSaving || !hasPendingChanges}
          onClick={handleSaveWorkout}
        >
          Save workout
        </Button>
      </HStack>
    </>
  );
};

Workout.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticatedLayout title="My workout">{page}</AuthenticatedLayout>;
};

export default Workout;
