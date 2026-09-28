import { APP_DESCRIPTION, APP_NAME } from '~/constants';

import type { Route } from './+types/home';
import { Welcome } from './home/welcome';

export const meta: Route.MetaFunction = () => [
  { title: APP_NAME },
  { name: 'description', content: APP_DESCRIPTION },
];

export default function Home() {
  return <Welcome />;
}
