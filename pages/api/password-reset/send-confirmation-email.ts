import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { httpResponse } from '../../../lib/http-responses';
import {
  BASE_URL,
  BCRYPT_SALT,
  SMTP2GO_API_KEY,
} from '../../../lib/environment';
import * as Sentry from '@sentry/nextjs';

const RequestSchema = z.object({
  email: z.string().email(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return httpResponse(res, 405);
  }
  const bodyParse = RequestSchema.safeParse(req.body);
  if (!bodyParse.success) {
    return httpResponse(res, 400);
  }

  const userEmail = bodyParse.data.email;

  try {
    const link = await generateLink(userEmail);

    if (link) {
      await sendEmail(userEmail, link);
    }

    return httpResponse(res, 200);
  } catch (e: any) {
    Sentry.captureException(e);
    console.error(e);
    return httpResponse(res, 500);
  }
};

const generateLink = async (userEmail: string) => {
  const user = await prisma.user.findFirst({
    where: { email: userEmail },
    include: {
      passwordResetToken: true,
    },
  });

  let link = null;
  if (user) {
    if (user.passwordResetToken) {
      await prisma.passwordResetToken.delete({
        where: { id: user.passwordResetToken.id },
      });
    }

    let resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, BCRYPT_SALT);

    await prisma.passwordResetToken.create({
      data: {
        token: resetTokenHash,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    link = `${BASE_URL}/password-reset/new-password?token=${resetToken}&id=${user.id}`;
  }

  return link;
};

const createTextBody = (link: string) => `
Hello!\n\n
Someone has requested a link to change your password for your More Reps account, and you can do this through the link below.\n\n
${link}\n\n
If you didn't request this, please ignore this email. No changes were made to your account.
`;

const createHtmlBody = (link: string) => `
<p>Hello!</p>
<p>Someone has requested a link to change your password for your More Reps account, and you can do this through the link below.</p>
<p><a href="${link}">Change my password</a></p>
<p>If you didn't request this, please ignore this email. No changes were made to your account.</p>
`;

const sendEmail = (to: string, link: string) => {
  return fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: SMTP2GO_API_KEY,
      to: [to],
      sender: 'More Reps <noreply@morereps.app>',
      subject: 'Password reset instructions for More Reps',
      text_body: createTextBody(link),
      html_body: createHtmlBody(link),
    }),
  });
};

export default handler;
