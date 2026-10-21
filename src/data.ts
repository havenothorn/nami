import type { Post, PostLanguage } from "./types";
import fm from "front-matter";
import { marked } from "marked";
import DOMPurify from "dompurify";

const rawModules = import.meta.glob("./content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const localizedPosts: (Post & { language: PostLanguage })[] = Object.values(
  rawModules,
).map((raw): Post & { language: PostLanguage } => {
  const parsed = fm(raw);
  const data = parsed.attributes as Record<string, any>;
  const content = parsed.body as string;
  // Convert markdown to HTML, then sanitize before it's ever injected via dangerouslySetInnerHTML
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
    translations: {},
  };
  return { ...post, language: data.language === "ko" ? "ko" : "en" };
});

const postsById = new Map<string, (Post & { language: PostLanguage })[]>();
for (const post of localizedPosts) {
  const translations = postsById.get(post.id) ?? [];
  translations.push(post);
  postsById.set(post.id, translations);
}

export const mockPosts: Post[] = Array.from(postsById.values()).map(
  (translations) => {
    const englishPost = translations.find((post) => post.language === "en");
    const koreanPost = translations.find((post) => post.language === "ko");
    const defaultPost = englishPost ?? koreanPost ?? translations[0];

    return {
      ...defaultPost,
      translations: Object.fromEntries(
        translations.map(({ language, title, excerpt, content, readTime }) => [
          language,
          { title, excerpt, content, readTime },
        ]),
      ),
    };
  },
);

export default mockPosts;
