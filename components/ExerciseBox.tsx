import {
  Box,
  Button,
  Center,
  Checkbox,
  HStack,
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
import { useState } from 'react';

interface ExerciseType {
  name: string;
}

interface Set {
  index: number;
  previousWeight?: number;
  weight?: number;
  reps?: number;
  previousReps?: number;
  isCompleted?: boolean;
}

interface Exercise {
  type: ExerciseType;
  sets: Set[];
}

interface ExerciseBoxProps {
  exercise: Exercise;
  onClickRemove: () => void;
}

const createInitialSetsIfEmpty = (sets: Set[]) => {
  if (sets.length === 0) {
    return [{ index: 1, isCompleted: false }];
  } else {
    return sets;
  }
};

const ExerciseBox = ({ exercise, onClickRemove }: ExerciseBoxProps) => {
  const [sets, setSets] = useState(createInitialSetsIfEmpty(exercise.sets));

  const handleAddNewSet = () => {
    setSets((previousSets) => [
      ...previousSets,
      {
        index: previousSets[previousSets.length - 1].index + 1,
        previousWeight: previousSets[previousSets.length - 1].previousWeight,
        previousReps: previousSets[previousSets.length - 1].previousReps,
        isCompleted: false,
      },
    ]);
  };

  return (
    <VStack>
      <HStack w="full" justifyContent="space-between">
        <Text as="b">{exercise.type.name}</Text>
        <Button onClick={onClickRemove} colorScheme="red" variant="ghost">
          Remove exercise
        </Button>
      </HStack>
      <Box w="full" border="1px" borderColor="gray.200" borderRadius="12px">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Set</Th>
                <Th>Weight</Th>
                <Th>Reps</Th>
                <Th>Completed</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sets.map((set) => (
                <Tr key={set.index}>
                  <Td>{set.index}</Td>
                  <Td>
                    <Input placeholder={`${set.previousWeight || ''}`}></Input>
                  </Td>
                  <Td>
                    <Input placeholder={`${set.previousReps || ''}`}></Input>
                  </Td>
                  <Td textAlign="center">
                    <Checkbox defaultChecked={set.isCompleted}></Checkbox>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th colSpan={4}>
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

export default ExerciseBox;
