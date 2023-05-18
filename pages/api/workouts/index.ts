import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { httpResponse } from '../../../lib/http-responses';
import prisma from '../../../lib/prisma';
import { User } from '@prisma/client';
import { WorkoutResponse, workoutSchema } from './[workoutId]';
import * as Sentry from '@sentry/nextjs';

export const DEFAULT_WORKOUT_SELECTION = {
  id: true,
  exercises: {
    select: {
      id: true,
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      sets: {
        select: {
          id: true,
          weight: true,
          reps: true,
        },
      },
    },
  },
};

export interface WorkoutListItem {
  id: number;
  finishedAt: Date;
  exerciseCount: number;
}

export interface WorkoutListResponse {
  workouts: WorkoutListItem[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return httpResponse(res, 401);
    }
    const userEmail = session.user.email;
    const databaseUser = await prisma.user.findFirstOrThrow({
      where: { email: userEmail },
    });

    switch (req.method) {
      case 'GET':
        return handleGet(res, databaseUser);
      case 'POST':
        return handlePost(req, res, databaseUser);
      default:
        return httpResponse(res, 405);
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);
    return httpResponse(res, 500);
  }
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const bodyParse = workoutSchema.safeParse(req.body);
  if (!bodyParse.success) {
    return httpResponse(res, 400);
  }

  const requestWorkout = bodyParse.data;

  const databaseWorkout = await prisma.workout.create({
    data: {
      userId: user.id,
      exercises: {
        create: requestWorkout.exercises.map((exercise) => ({
          exerciseTypeId: exercise.type.id,
          sets: {
            create: exercise.sets.map((set) => ({
              reps: set.reps,
              weight: set.weight,
            })),
          },
        })),
      },
    },
    select: DEFAULT_WORKOUT_SELECTION,
  });

  return res.status(200).json({
    workout: databaseWorkout,
  } as WorkoutResponse);
};

const handleGet = async (res: NextApiResponse, user: User) => {
  const rawItems = await prisma.workout.findMany({
    where: { user },
    orderBy: {
      id: 'desc',
    },
    take: 10,
    include: {
      _count: {
        select: { exercises: true },
      },
    },
  });

  return res.status(200).json({
    workouts: rawItems.map((item) => ({
      id: item.id,
      finishedAt: item.finishedAt,
      exerciseCount: item._count.exercises,
    })),
  } as WorkoutListResponse);
};

export default handler;
