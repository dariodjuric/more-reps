import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { httpResponse } from '../../lib/http-responses';
import prisma from '../../lib/prisma';

export interface ExerciseTypesResponse {
  types: {
    id: number;
    name: string;
  }[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return httpResponse(res, 401);
  }

  const exerciseTypes = await prisma.exerciseType.findMany();
  // Sort alphabetically by name
  exerciseTypes.sort((a, b) => a.name.localeCompare(b.name));

  return res.status(200).json({
    types: exerciseTypes.map((exerciseType) => ({
      id: exerciseType.id,
      name: exerciseType.name,
    })),
  } as ExerciseTypesResponse);
};

export default handler;
