import { Button, Center, VStack } from '@chakra-ui/react';
import ExerciseListItem from './ExerciseListItem';
import ExerciseSelectorDrawer, {
  ExerciseTypeWithLastSet,
} from './ExerciseSelectorDrawer';
import { ExercisePayload, SetPayload } from '../pages/api/workouts/[workoutId]';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

interface Props {
  initialExercises: ExercisePayload[];
  onUpdate: (exercises: ExercisePayload[]) => void;
}

type ExerciseWithKey = ExercisePayload & { key: string };

const createKeys = (exercises: ExercisePayload[]): ExerciseWithKey[] => {
  return structuredClone(exercises).map((exercise) => ({
    ...exercise,
    key: String(exercise.id),
  }));
};

export const ExerciseList = ({ initialExercises, onUpdate }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [exercises, setExercises] = useState(createKeys(initialExercises));

  const handleAddNewExercise = (exerciseType: ExerciseTypeWithLastSet) => {
    const newExercises = [
      ...exercises,
      {
        id: null,
        key: uuid(),
        type: exerciseType,
        sets: [
          {
            id: null,
            reps: exerciseType?.lastReps || 0,
            weight: exerciseType?.lastWeight || 0,
          },
        ],
      },
    ];
    setExercises(newExercises);
    setIsDrawerOpen(false);
    onUpdate(newExercises);
  };

  const handleRemoveExercise = (key: string) => {
    const newExercises = exercises.filter((set) => set.key !== key);
    setExercises(newExercises);
    onUpdate(newExercises);
  };

  const handleUpdate = (exerciseKey: string, updatedSets: SetPayload[]) => {
    const exercisesCopy = exercises.map((exercise) => ({ ...exercise }));
    const exerciseToUpdate = exercisesCopy.find(
      (exercise) => exercise.key === exerciseKey
    );
    if (exerciseToUpdate) {
      exerciseToUpdate.sets = updatedSets;
    }
    setExercises(exercisesCopy);
    onUpdate(exercisesCopy);
  };

  return (
    <VStack w="full" gap={5}>
      {exercises.map((exercise) => (
        <ExerciseListItem
          key={exercise.key}
          initialExercise={exercise}
          onClickRemove={() => handleRemoveExercise(exercise.key)}
          onUpdate={(sets) => handleUpdate(exercise.key, sets)}
        ></ExerciseListItem>
      ))}
      <Center>
        <ExerciseSelectorDrawer
          isShown={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSelect={handleAddNewExercise}
        ></ExerciseSelectorDrawer>
        <Button onClick={() => setIsDrawerOpen(true)}>Add exercise</Button>
      </Center>
    </VStack>
  );
};
