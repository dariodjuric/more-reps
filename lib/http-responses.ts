import { NextApiResponse } from 'next';

export const httpResponse = (
  res: NextApiResponse,
  statusCode: number,
  message?: string
) => {
  let messageForResponse = message;

  if (!messageForResponse) {
    switch (statusCode) {
      case 200:
        messageForResponse = 'Request processed successfully';
        break;
      case 400:
        messageForResponse = 'Invalid request';
        break;
      case 405:
        messageForResponse = 'Invalid method';
        break;
      case 500:
        messageForResponse = 'Internal server error';
        break;
    }
  }

  return res.status(statusCode).json({ message: messageForResponse });
};
