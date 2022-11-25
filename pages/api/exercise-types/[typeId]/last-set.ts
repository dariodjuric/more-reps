import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { httpResponse } from '../../../../lib/http-responses';
import prisma from '../../../../lib/prisma';

export interface LastSetResponse {
  reps: number | null;
  weight: number | null;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      return httpResponse(res, 401);
    }

    const typeId = Number(req.query.typeId);

    const latestWorkout = await prisma.workout.findFirst({
      orderBy: {
        finishedAt: 'desc',
      },
    });

    let latestSet = null;
    if (latestWorkout) {
      latestSet = await prisma.set.findFirst({
        select: {
          reps: true,
          weight: true,
        },
        where: {
          exercise: {
            exerciseTypeId: typeId,
            workoutId: latestWorkout.id,
          },
        },
      });
    }

    return res.status(200).json({
      reps: latestSet?.reps || null,
      weight: latestSet?.weight || null,
    } as LastSetResponse);
  } catch (e) {
    console.error(e);
    return httpResponse(res, 500);
  }
};

export default handler;
