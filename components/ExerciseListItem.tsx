import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ExercisePayload, SetPayload } from '../pages/api/workouts/[workoutId]';

interface ExerciseBoxProps {
  initialExercise: ExercisePayload;
  onClickRemove: () => void;
  onUpdate: (sets: SetPayload[]) => void;
}

type SetWithKey = SetPayload & { key: string };

const createSetsForState = (sets: SetPayload[]): SetWithKey[] => {
  if (sets.length === 0) {
    return [{ id: null, key: uuid(), reps: 0, weight: 0 }];
  } else {
    return sets.map((set) => ({ ...set, key: String(set.id) }));
  }
};

const ExerciseListItem = ({
  initialExercise,
  onClickRemove,
  onUpdate,
}: ExerciseBoxProps) => {
  const [sets, setSets] = useState(createSetsForState(initialExercise.sets));

  const handleAddNewSet = () => {
    const newSets = [
      ...sets,
      {
        id: null,
        key: uuid(),
        reps: sets[sets.length - 1]?.reps || 0,
        weight: sets[sets.length - 1]?.weight || 0,
      },
    ];
    setSets(newSets);
    onUpdate(newSets);
  };

  const handleRemoveSet = (key: string) => {
    const newSets = sets.filter((set) => set.key !== key);
    setSets(newSets);
    onUpdate(newSets);
  };

  const handleSetOrRepUpdate = (
    key: string,
    newWeight: number,
    newReps: number
  ) => {
    const setsCopy = sets.map((set) => ({ ...set }));
    const setToUpdate = setsCopy.find((set) => set.key === key);
    if (setToUpdate) {
      setToUpdate.reps = newReps;
      setToUpdate.weight = newWeight;
    }
    setSets(setsCopy);
    onUpdate(setsCopy);
  };

  return (
    <VStack>
      <HStack w="full" justifyContent="space-between">
        <Text as="b">{initialExercise.type.name}</Text>
        <Button onClick={onClickRemove} colorScheme="red" variant="ghost">
          Remove exercise
        </Button>
      </HStack>
      <Box
        w="full"
        border="1px"
        borderColor="gray.200"
        borderRadius="12px"
        pl={2}
        pr={2}
      >
        <TableContainer>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th p={3}>Set</Th>
                <Th p={3}>Weight</Th>
                <Th p={3}>Reps</Th>
                <Th p={3}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {sets.map((set, index) => (
                <Tr key={set.key}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Input
                      type="number"
                      defaultValue={set.weight}
                      onChange={(e) =>
                        handleSetOrRepUpdate(
                          set.key,
                          Number(e.currentTarget.value),
                          set.reps
                        )
                      }
                    ></Input>
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      defaultValue={set.reps}
                      onChange={(e) =>
                        handleSetOrRepUpdate(
                          set.key,
                          set.weight,
                          Number(e.currentTarget.value)
                        )
                      }
                    ></Input>
                  </Td>
                  <Td textAlign="center">
                    <IconButton
                      colorScheme="red"
                      aria-label="Remove set"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSet(set.key)}
                      icon={<DeleteIcon />}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th colSpan={4} p={3}>
                  <Center>
                    <Button onClick={handleAddNewSet} variant="outline">
                      Add set
                    </Button>
                  </Center>
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
    </VStack>
  );
};

export default ExerciseListItem;
