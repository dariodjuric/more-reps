import { NextPageWithLayout } from './_app';
import { Button, Center, HStack, VStack } from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import ExerciseBox from '../components/ExerciseBox';
import ExerciseSelectorDrawer from '../components/ExerciseSelectorDrawer';

const PastWorkouts: NextPageWithLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // @ts-ignore
  return (
    <VStack w="full">
      <ExerciseBox
        exercise={{
          type: { name: 'Deadlift' },
          sets: [
            { index: 1, previousWeight: 80, previousReps: 8 },
            { index: 2, previousWeight: 80, previousReps: 8 },
          ],
        }}
        onClickRemove={() => {}}
      ></ExerciseBox>
      <Center>
        <ExerciseSelectorDrawer isShown={isDrawerOpen}></ExerciseSelectorDrawer>
        <Button onClick={() => setIsDrawerOpen(true)}>Add exercise</Button>
      </Center>

      <HStack pt="18" w="full" justifyContent="space-between">
        <Button colorScheme="red" variant="ghost">
          Remove workout
        </Button>
        <Button>Save workout</Button>
      </HStack>
    </VStack>
  );
};

PastWorkouts.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticatedLayout title="New workout">{page}</AuthenticatedLayout>;
};

export default PastWorkouts;
