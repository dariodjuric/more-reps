import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { httpResponse } from '../../../lib/http-responses';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { User } from '@prisma/client';
import { DEFAULT_WORKOUT_SELECTION } from './index';

export interface ExerciseTypeData {
  id: number;
  name: string;
}

export interface SetData {
  id: number | null;
  weight: number;
  reps: number;
  previousWeight?: number;
  previousReps?: number;
}

export interface ExerciseData {
  id: number | null;
  type: ExerciseTypeData;
  sets: SetData[];
}

export interface WorkoutData {
  id: number | null;
  exercises: ExerciseData[];
}

export interface WorkoutResponse {
  workout: WorkoutData;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return httpResponse(res, 401);
    }
    const workoutId = Number(req.query.workoutId);
    const userEmail = session.user.email;
    const databaseUser = await prisma.user.findFirstOrThrow({
      where: { email: userEmail },
    });

    switch (req.method) {
      case 'GET':
        return handleGet(workoutId, res, databaseUser);
      case 'PUT':
        return handlePut(workoutId, req, res, databaseUser);
      case 'DELETE':
        return handleDelete(workoutId, req, res, databaseUser);
      default:
        return httpResponse(res, 405);
    }
  } catch (e) {
    console.error(e);
    return httpResponse(res, 500);
  }
};

export const findWorkoutForResponse = (workoutId: number, user: User) => {
  return prisma.workout.findFirst({
    where: { id: workoutId, user },
    select: DEFAULT_WORKOUT_SELECTION,
  });
};

const handleGet = async (
  workoutId: number,
  res: NextApiResponse,
  user: User
) => {
  const workout = await findWorkoutForResponse(workoutId, user);

  if (!workout) {
    return httpResponse(res, 404);
  }

  return res.status(200).json({
    workout: workout,
  } as WorkoutResponse);
};

const handleDelete = async (
  workoutId: number,
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, user },
  });

  if (!workout) {
    return httpResponse(res, 404);
  }

  await prisma.workout.delete({ where: { id: workoutId } });

  return httpResponse(res, 200);
};

const handlePut = async (
  workoutId: number,
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  // Make sure that the workflow is accessible by the user
  let databaseWorkout = await findWorkoutForResponse(workoutId, user);

  if (!databaseWorkout) {
    return httpResponse(res, 404);
  }

  const requestWorkout = req.body as WorkoutData;

  const { deletedExerciseIds, exerciseIdsToDeletedSetIds } =
    getDeletedExercisesAndSets(requestWorkout, databaseWorkout);

  const getDeletedSetIdsForExercise = (exerciseId: number) => {
    let ids: number[] = [];
    if (exerciseIdsToDeletedSetIds.has(exerciseId)) {
      ids = Array.from(
        exerciseIdsToDeletedSetIds.get(exerciseId) as Set<number>
      );
    }
    return ids;
  };

  const updatedDatabaseWorkout = await prisma.workout.update({
    where: { id: workoutId },
    data: {
      exercises: {
        update: requestWorkout.exercises
          .filter((exercise) => !!exercise.id)
          .map((exercise) => ({
            data: {
              sets: {
                update: exercise.sets
                  .filter((set) => !!set.id)
                  .map((set) => ({
                    data: {
                      reps: set.reps,
                      weight: set.weight,
                    },
                    where: { id: set.id as number },
                  })),
                create: exercise.sets
                  .filter((set) => !set.id)
                  .map((set) => ({
                    reps: set.reps,
                    weight: set.weight,
                  })),
                delete: getDeletedSetIdsForExercise(exercise.id as number).map(
                  (id) => ({ id })
                ),
              },
            },
            where: { id: exercise.id as number },
          })),
        create: requestWorkout.exercises
          .filter((exercise) => !exercise.id) // Only new entries
          .map((exercise) => ({
            exerciseTypeId: exercise.type.id,
            sets: {
              create: exercise.sets.map((set) => ({
                reps: set.reps,
                weight: set.weight,
              })),
            },
          })),
        delete: Array.from(deletedExerciseIds).map((id) => ({ id })),
      },
    },
    select: DEFAULT_WORKOUT_SELECTION,
  });

  return res.status(200).json({
    workout: updatedDatabaseWorkout,
  } as WorkoutResponse);
};

const getDeletedExercisesAndSets = (
  requestWorkout: WorkoutData,
  databaseWorkout: WorkoutData
) => {
  const exerciseIdsInRequest = new Set<number>();
  const setIdsInRequest = new Set<number>();
  requestWorkout.exercises
    .filter((e) => !!e.id)
    .forEach((e) => {
      exerciseIdsInRequest.add(e.id as number);
      e.sets
        .filter((s) => !!s.id)
        .forEach((s) => {
          setIdsInRequest.add(s.id as number);
        });
    });

  const deletedExerciseIds = new Set<number>();
  const exerciseIdsToDeletedSetIds = new Map<number, Set<number>>();
  databaseWorkout.exercises.forEach((e) => {
    const exerciseId = e.id as number;
    if (!exerciseIdsInRequest.has(exerciseId)) {
      deletedExerciseIds.add(exerciseId);
    }

    e.sets.forEach((s) => {
      const setId = s.id as number;
      if (!setIdsInRequest.has(setId)) {
        let deletedSetIds = exerciseIdsToDeletedSetIds.get(exerciseId);
        if (!deletedSetIds) {
          deletedSetIds = new Set<number>();
          exerciseIdsToDeletedSetIds.set(exerciseId, deletedSetIds);
        }
        deletedSetIds.add(setId);
      }
    });
  });

  return { deletedExerciseIds, exerciseIdsToDeletedSetIds };
};

export default handler;
