import { Post } from "./types";
import fm from "front-matter";
import { marked } from "marked";

// Support environments where import.meta.globEager may not exist at runtime.
// Prefer Vite's newer query API for raw imports.
let rawModules: Record<string, string> = {};

if (typeof (import.meta as any).globEager === "function") {
  // Use query API if supported by Vite, fallback keeps compatibility
  try {
    rawModules = (import.meta as any).globEager("./content/posts/*.md", {
      query: "?raw",
      import: "default",
    }) as Record<string, string>;
  } catch (e) {
    rawModules = (import.meta as any).globEager("./content/posts/*.md", {
      as: "raw",
    }) as Record<string, string>;
  }
} else {
  const loaders = import.meta.glob("./content/posts/*.md", {
    query: "?raw",
    import: "default",
  }) as Record<string, () => Promise<string>>;
  const entries = await Promise.all(
    Object.entries(loaders).map(
      async ([path, loader]) => [path, await loader()] as const,
    ),
  );
  rawModules = Object.fromEntries(entries);
}

export const mockPosts: Post[] = Object.values(rawModules).map((raw) => {
  const parsed = fm(raw);
  const data = parsed.attributes as Record<string, any>;
  const content = parsed.body as string;
  // Convert markdown body to HTML for direct injection into React components
  const contentHtml = marked(content || "");
  const post: Post = {
    id: String(data.id),
    title: String(data.title),
    excerpt: String(data.excerpt || ""),
    content: String(contentHtml),
    category: data.category as Post["category"],
    tags: (data.tags || []) as string[],
    date: String(data.date || ""),
    readTime: String(data.readTime || ""),
    imageUrl: data.imageUrl,
    author: data.author,
    codeBlock: data.codeBlock,
    engagementScore: data.engagementScore,
    recommendedPostIds: (data.recommendedPostIds || []) as string[],
  };
  return post;
});

export default mockPosts;
