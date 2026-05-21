/**
 * Ambient declaration so TypeScript understands `*.vue` single-file component
 * imports. Vue's SFC compiler turns each `.vue` file into a component; this
 * shim gives the type system a matching module declaration.
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}
