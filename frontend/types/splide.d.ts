/**
 * This declaration file is a workaround for an issue with the @splidejs/react-splide package.
 * The package.json "exports" map prevents TypeScript's "bundler" module resolution strategy
 * from finding the built-in type declarations.
 *
 * This file explicitly declares the package's named React components,
 * resolving the module resolution and "no exported member" errors.
 */
declare module '@splidejs/react-splide' {
  type SplideProps = import('react').PropsWithChildren<Record<string, unknown>>;
  export const Splide: import('react').ComponentType<SplideProps>;
  export const SplideSlide: import('react').ComponentType<SplideProps>;
  // You might need to add other types or components here if you use them, e.g.:
  // export type { Options } from '@splidejs/splide';
}
