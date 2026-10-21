/**
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PostCategory = string;
export type PostLanguage = "en" | "ko";

export interface PostTranslation {
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
}

export interface Author {
  name: string;
  avatarUrl: string;
  role: string;
}

export interface CodeBlockData {
  filename: string;
  code: string;
  language: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML-like formatted text segments or markdown
  category: PostCategory;
  tags: string[];
  date: string;
  readTime: string;
  imageUrl?: string;
  author: Author;
  codeBlock?: CodeBlockData;
  engagementScore?: string;
  recommendedPostIds: string[];
  translations: Partial<Record<PostLanguage, PostTranslation>>;
}
