import { NextApiResponse } from 'next';

export const httpResponse = (
  res: NextApiResponse,
  statusCode: number,
  message?: string
) => {
  let responseMessage = message;

  if (!responseMessage) {
    switch (statusCode) {
      case 200:
        responseMessage = 'Request processed successfully';
        break;
      case 400:
        responseMessage = 'Invalid request';
        break;
      case 401:
        responseMessage = 'Unauthorized';
        break;
      case 405:
        responseMessage = 'Invalid method';
        break;
      case 500:
        responseMessage = 'Internal server error';
        break;
    }
  }

  return res.status(statusCode).json({ message: responseMessage });
};
