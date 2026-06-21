import { Post } from "./types";

declare module "./data" {
  export const mockPosts: Post[];
  const _default: Post[];
  export default _default;
}

// Also provide a declaration for imports using ../data from files in subfolders
declare module "../data" {
  export const mockPosts: Post[];
  const _default: Post[];
  export default _default;
}

export {};
