import { APP_DESCRIPTION, APP_NAME } from '~/constants';

import { Welcome } from '../welcome/welcome';
import type { Route } from './+types/home';

export const meta: Route.MetaFunction = () => [
  { title: APP_NAME },
  { name: 'description', content: APP_DESCRIPTION },
];

export default function Home() {
  return <Welcome />;
}
