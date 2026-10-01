// This is the APPLICATION allowlist. The hosting router needs a matching allowlist.
// Nothing in this file changes trackier.com or its web server.
export type ReactRoute = { path: string; slug: string };
export const reactRoutes: readonly ReactRoute[] = [
  { path: '/react-demo/', slug: 'react-demo' },
  { path: '/react-demo/reuse/', slug: 'reuse-demo' },
];

export function findReactRoute(path: string): ReactRoute | undefined {
  return reactRoutes.find((route) => route.path === path);
}

export function pathFromSegments(segments: string[]): string {
  return `/${segments.join('/')}/`;
}
