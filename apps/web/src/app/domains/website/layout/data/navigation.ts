import { INavigationLink } from '../interfaces';

export const NAVIGATION_LINKS: readonly INavigationLink[] = [
  { label: 'Home', path: '/', icon: 'house' },
  { label: 'Features', path: '/', fragment: 'features', icon: 'blocks' },
  { label: 'Get started', path: '/', fragment: 'get-started', icon: 'rocket' }
];
