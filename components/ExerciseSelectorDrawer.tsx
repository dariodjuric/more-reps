import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  StackDivider,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';
import { ExerciseTypesResponse } from '../pages/api/exercise-types';
import { TextLink } from './TextLink';
import { LoadingMessage } from './LoadingMessage';
import { useState } from 'react';
import { ExerciseTypePayload } from '../pages/api/workouts/[workoutId]';
import * as Sentry from '@sentry/nextjs';

export type ExerciseTypeWithLastSet = ExerciseTypePayload & {
  lastReps: number | null;
  lastWeight: number | null;
};

interface Props {
  isShown: boolean;
  onClose: () => void;
  onSelect: (exerciseType: ExerciseTypeWithLastSet) => void;
}

const ExerciseSelectorDrawer = ({ isShown, onClose, onSelect }: Props) => {
  const { data } = useSWR<ExerciseTypesResponse>(
    '/api/exercise-types',
    fetcher
  );
  const [isSelectionError, setIsSelectionError] = useState(false);

  const handleSelect = async (exerciseType: ExerciseTypePayload) => {
    try {
      const lastSet = await fetcher(
        `/api/exercise-types/${exerciseType.id}/last-set`
      );
      onSelect({
        ...exerciseType,
        lastReps: lastSet.reps,
        lastWeight: lastSet.weight,
      });
      setIsSelectionError(false);
    } catch (e) {
      Sentry.captureException(e);
      console.error(e);
      setIsSelectionError(true);
    }
  };

  return (
    <Drawer isOpen={isShown} onClose={() => onClose()} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Select your exercise</DrawerHeader>

        <DrawerBody>
          {!data && <LoadingMessage>Loading exercises</LoadingMessage>}
          {data && (
            <Stack divider={<StackDivider />} spacing="4">
              {data.types.map((exerciseType) => (
                <TextLink
                  key={exerciseType.id}
                  color="black"
                  onClick={() => handleSelect(exerciseType)}
                >
                  {exerciseType.name}
                </TextLink>
              ))}
            </Stack>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" onClick={() => onClose()}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ExerciseSelectorDrawer;
