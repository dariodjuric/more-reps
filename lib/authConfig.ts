export const ironOptions = {
  cookieName: 'more-reps-cookie',
  // ToDo change
  password: 'HxabZq6aJUTep71BR2nro7hPpDgyHtiL',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export interface User {
  id: string;
  email: string;
  name: string;
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
  }
}
