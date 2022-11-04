import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from '../../lib/authConfig';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserStatus } from './user';

export default withIronSessionApiRoute(logoutRoute, ironOptions);

async function logoutRoute(
  req: NextApiRequest,
  res: NextApiResponse<UserStatus>
) {
  req.session.destroy();
  res.json({ isLoggedIn: false, user: null });
}
