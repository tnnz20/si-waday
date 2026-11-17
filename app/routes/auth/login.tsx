import { redirect, useNavigation } from 'react-router';
import { LoginCard } from '~/components/auth/login-card';
import { authenticateUser, signAccessToken, signRefreshToken } from '~/lib/auth.server';
import { createAuthCookies, getAuthUser } from '~/lib/session.server';

import type { Route } from './+types/login';

export const meta: Route.MetaFunction = () => [
  { title: 'Masuk • SI-WADAY Kabupaten Tapin' },
  {
    name: 'description',
    content: 'Pusat Kendali Terpadu Aduan Pelayanan Publik dan Pokok Pikiran DPRD Kabupaten Tapin.',
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const authResult = await getAuthUser(request);
  if (authResult) {
    return redirect('/dashboard');
  }

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
  return { redirectTo };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const identifier = String(formData.get('identifier') || formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const rawRedirectTo = String(formData.get('redirectTo') || '/dashboard');
  const redirectTo =
    rawRedirectTo.startsWith('/') && !rawRedirectTo.startsWith('//') ? rawRedirectTo : '/dashboard';

  if (!identifier || !password) {
    return { error: 'Email atau username dan kata sandi wajib diisi.' };
  }

  const authResult = await authenticateUser(identifier, password);
  if (!authResult.success) {
    return { error: authResult.error };
  }

  const accessToken = await signAccessToken(authResult.user);
  const refreshToken = await signRefreshToken(authResult.user.id);
  const headers = createAuthCookies({ accessToken, refreshToken });

  return redirect(redirectTo, { headers });
}

export default function LoginPage({ loaderData, actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="animate-in fade-in-50 zoom-in-95 w-full max-w-md duration-200">
      <LoginCard
        redirectTo={loaderData.redirectTo}
        error={actionData?.error}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
