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
    if (!session || !session.user?.email) {
      return httpResponse(res, 401);
    }

    const typeId = Number(req.query.typeId);

    if (!typeId) {
      return httpResponse(res, 400);
    }

    const userEmail = session.user.email;
    const databaseUser = await prisma.user.findFirstOrThrow({
      where: { email: userEmail },
    });

    const latestSet = await prisma.set.findFirst({
      select: {
        reps: true,
        weight: true,
      },
      where: {
        exercise: {
          exerciseTypeId: typeId,
          workout: {
            user: databaseUser,
          },
        },
      },
      orderBy: {
        exercise: {
          workout: {
            finishedAt: 'desc',
          },
        },
      },
    });

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
