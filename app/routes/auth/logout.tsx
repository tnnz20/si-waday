import { redirect } from 'react-router';
import { clearAuthCookies } from '~/lib/session.server';

export async function action() {
  return redirect('/auth/login', { headers: clearAuthCookies() });
}

export async function loader() {
  return redirect('/auth/login');
}

export default function LogoutRoute() {
  return null;
}
