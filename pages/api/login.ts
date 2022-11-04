import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions, User } from '../../lib/authConfig';
import { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(loginRoute, ironOptions);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User | null;
}

async function loginRoute(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // get user from database then:
  req.session.user = {
    id: '230',
    email: 'dario.djuric@gmail.com',
    name: 'Dario Djuric',
  };
  await req.session.save();
  res.send({ user: req.session.user });
}
