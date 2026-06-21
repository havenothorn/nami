/// <reference types="vite/client" />

export {};

declare global {
  interface ImportMeta {
    globEager<T = any>(pattern: string): Record<string, { default: T }>;
    glob<T = any>(
      pattern: string,
    ): Record<string, () => Promise<{ default: T }>>;
    globEager(pattern: string, options: { as: "raw" }): Record<string, string>;
    glob(
      pattern: string,
      options: { as: "raw" },
    ): Record<string, () => Promise<string>>;
    globEager(
      pattern: string,
      options: { query: string; import: "default" },
    ): Record<string, string>;
    glob(
      pattern: string,
      options: { query: string; import: "default" },
    ): Record<string, () => Promise<string>>;
  }
}
