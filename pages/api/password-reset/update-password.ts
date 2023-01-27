import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '../../../lib/prisma';
import { httpResponse } from '../../../lib/http-responses';
import { PasswordResetToken } from '@prisma/client';
import { addHours, isBefore } from 'date-fns';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT } from '../../../lib/environment';
import * as Sentry from '@sentry/nextjs';

const RequestSchema = z.object({
  userId: z.number(),
  token: z.string().length(64),
  newPassword: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return httpResponse(res, 405);
  }
  const bodyParse = RequestSchema.safeParse(req.body);
  if (!bodyParse.success) {
    return httpResponse(res, 400);
  }

  const { userId, token: resetTokenHash, newPassword } = bodyParse.data;

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        passwordResetToken: true,
      },
    });

    if (
      user &&
      user.passwordResetToken &&
      isResetTokenValid(user.passwordResetToken)
    ) {
      const areTokenHashesSame = await bcrypt.compare(
        resetTokenHash,
        user.passwordResetToken.token
      );

      if (areTokenHashesSame) {
        const newPasswordHash = await bcrypt.hash(newPassword, BCRYPT_SALT);

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: newPasswordHash,
          },
        });

        await prisma.passwordResetToken.delete({
          where: { id: user.passwordResetToken.id },
        });

        return httpResponse(res, 200);
      } else {
        return httpResponse(res, 500, 'Invalid token');
      }
    } else {
      return httpResponse(res, 500, 'Invalid token');
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);
    return httpResponse(res, 500);
  }
};

const isResetTokenValid = (token: PasswordResetToken) =>
  isBefore(new Date(), addHours(token.createdAt, 1));

export default handler;
