import { Post } from "./types";
import fm from "front-matter";
import { marked } from "marked";
import DOMPurify from "dompurify";

const rawModules = import.meta.glob("./content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const mockPosts: Post[] = Object.values(rawModules).map((raw) => {
  const parsed = fm(raw);
  const data = parsed.attributes as Record<string, any>;
  const content = parsed.body as string;
  // Convert markdown body to HTML, then sanitize before it's ever injected via dangerouslySetInnerHTML
  const contentHtml = DOMPurify.sanitize(marked(content || "") as string);
  const post: Post = {
    id: String(data.id),
    title: String(data.title),
    excerpt: String(data.excerpt || ""),
    content: contentHtml,
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
