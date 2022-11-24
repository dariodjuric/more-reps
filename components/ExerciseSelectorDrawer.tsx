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
  Text,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';
import { ExerciseTypesResponse } from '../pages/api/exercise-types';
import { TextLink } from './TextLink';

interface Props {
  isShown: boolean;
  onClose: () => void;
  onSelect: (exerciseTypeId: number) => void;
}

const ExerciseSelectorDrawer = ({ isShown, onClose, onSelect }: Props) => {
  const { data } = useSWR<ExerciseTypesResponse>(
    '/api/exercise-types',
    fetcher
  );

  return (
    <Drawer isOpen={isShown} onClose={() => onClose()} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Select your exercise</DrawerHeader>

        <DrawerBody>
          {!data && <Text>Loading...</Text>}
          {data && (
            <Stack divider={<StackDivider />} spacing="4">
              {data.types.map(({ id, name }) => (
                <TextLink key={id} color="black" onClick={() => onSelect(id)}>
                  {name}
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
