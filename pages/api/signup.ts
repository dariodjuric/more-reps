import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';

const RequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface SignUpResponse {
  message?: string;
  user?: {
    id: number;
    email: string;
  };
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SignUpResponse>
) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Must be POST request' });
  }
  const bodyParse = RequestSchema.safeParse(req.body);
  if (!bodyParse.success) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  try {
    const passwordHash = await bcrypt.hash(bodyParse.data.password, 0);
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
    return res.status(500).json({ message });
  }
};

export default handler;
