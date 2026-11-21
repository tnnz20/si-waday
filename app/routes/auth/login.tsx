import { redirect, useNavigation } from 'react-router';
import { LoginCard } from '~/components/auth/login-card';
import { authenticateUser, signAccessToken, signRefreshToken } from '~/lib/auth.server';
import { createAuthCookies, getAuthUser } from '~/lib/session.server';
import { loginSchema } from '~/schema/auth';

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
  const rawData = {
    identifier: formData.get('identifier'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo'),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors: { identifier?: string; password?: string } = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0];
      if (field === 'identifier' && !fieldErrors.identifier) {
        fieldErrors.identifier = issue.message;
      }
      if (field === 'password' && !fieldErrors.password) {
        fieldErrors.password = issue.message;
      }
    }

    return {
      error: 'Mohon periksa kembali isian formulir Anda.',
      fieldErrors,
    };
  }

  const { identifier, password, redirectTo: rawRedirectTo } = validation.data;
  const redirectTo =
    rawRedirectTo && rawRedirectTo.startsWith('/') && !rawRedirectTo.startsWith('//')
      ? rawRedirectTo
      : '/dashboard';

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
        fieldErrors={actionData?.fieldErrors}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
