import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';
import { httpResponse } from '../../lib/http-responses';
import { BCRYPT_SALT } from '../../lib/environment';

const RequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return httpResponse(res, 405);
  }
  const bodyParse = RequestSchema.safeParse(req.body);
  if (!bodyParse.success) {
    return httpResponse(res, 400);
  }

  try {
    const passwordHash = await bcrypt.hash(
      bodyParse.data.password,
      BCRYPT_SALT
    );
    const user = await prisma.user.create({
      data: {
        email: bodyParse.data.email,
        password: passwordHash,
        registeredAt: new Date(),
      },
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (e: any) {
    let message = 'Error adding user';
    if (e?.message?.includes('Unique constraint failed')) {
      message = 'User already exists';
    }
    console.error(e);
    return httpResponse(res, 500, message);
  }
};

export default handler;
