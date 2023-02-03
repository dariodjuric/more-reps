import { NextPageWithLayout } from './_app';
import { Button, HStack } from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { ExerciseList } from '../components/ExerciseList';
import { useRouter } from 'next/router';
import {
  ExercisePayload,
  WorkoutPayload,
  WorkoutResponse,
} from './api/workouts/[workoutId]';
import { useSWRConfig } from 'swr';
import { fetcher } from '../lib/fetcher';

const PastWorkouts: NextPageWithLayout = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [workout, setWorkout] = useState<WorkoutPayload>({
    id: null,
    exercises: [],
  });
  const [isSaving, setSaving] = useState(false);

  const handleUpdateWorkout = (exercises: ExercisePayload[]) => {
    const workoutCopy = structuredClone(workout);
    workoutCopy.exercises = exercises;
    setWorkout(workoutCopy);
  };

  const handleRemoveWorkout = async () => {
    await router.push('/');
  };

  const handleSaveWorkout = async () => {
    setSaving(true);
    const response = await mutate<WorkoutResponse>(
      '/api/workouts',
      fetcher('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
      })
    );
    setSaving(false);
    await router.push(`/workouts/${response?.workout.id}`);
  };

  return (
    <>
      <ExerciseList initialExercises={[]} onUpdate={handleUpdateWorkout} />
      <HStack pt="12" w="full" justifyContent="space-between">
        <Button colorScheme="red" variant="ghost" onClick={handleRemoveWorkout}>
          Remove workout
        </Button>
        <Button disabled={isSaving} onClick={handleSaveWorkout}>
          Save workout
        </Button>
      </HStack>
    </>
  );
};

PastWorkouts.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticatedLayout title="New workout">{page}</AuthenticatedLayout>;
};

export default PastWorkouts;
