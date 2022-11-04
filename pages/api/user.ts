import { ironOptions, User } from '../../lib/authConfig';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(userRoute, ironOptions);

export type UserStatus = {
  isLoggedIn: boolean;
  user: User | null;
};

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<UserStatus>
) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      user: req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      user: null,
      isLoggedIn: false,
    });
  }
}
