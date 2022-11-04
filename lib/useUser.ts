import useSWR from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserStatus } from '../pages/api/user';

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

export function useUser({
  redirectTo = '',
  redirectIfLoggedIn: redirectIfLoggedIn = false,
} = {}) {
  const router = useRouter();
  const { data: userStatus, mutate: mutateUser } = useSWR<UserStatus>(
    '/api/user',
    fetcher
  );

  useEffect(() => {
    // if no redirect needed, just return (example: already on the landing page)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !userStatus) return;

    // redirect if not logged in, or redirect if logged in and we want to redirect
    if (
      (redirectTo && !redirectIfLoggedIn && !userStatus?.isLoggedIn) ||
      (redirectIfLoggedIn && userStatus?.isLoggedIn)
    ) {
      console.log('routing to' + redirectTo);
      router.push(redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus, redirectIfLoggedIn, redirectTo]);

  return { userStatus, mutateUser };
}
