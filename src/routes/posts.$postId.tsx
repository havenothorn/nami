/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoute, Link } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { mockPosts } from "../data";
import { NotFound } from "../NotFound";
import {
  ArrowLeft,
  Clock,
  Share2,
  Clipboard,
  Check,
  Heart,
  Bookmark,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Post } from "../types";
import defaultAvatar from "../assets/profile.jpg";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$postId",
  component: PostDetailPage,
});

function PostDetailPage() {
  const { postId } = Route.useParams();

  // Find current post by postId
  const post = mockPosts.find((p: Post) => p.id === postId);

  // States
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Reset local reaction state when navigating between posts
  useEffect(() => {
    setLikesCount(0);
    setLiked(false);
    setBookmarked(false);
  }, [postId]);

  if (!post) {
    return (
      <NotFound
        title="Post Not Found!"
        message="Oops! The post you're looking for can't be found or has been moved."
      />
    );
  }

  // Handle source copying
  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Handle Likes
  const handleLikeClick = () => {
    if (liked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  // Handle share link copying
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Fetch Recommended posts
  const recommendedPosts = mockPosts.filter((p: Post) =>
    post.recommendedPostIds.includes(p.id),
  );

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
        Back to home
      </Link>

      <article className="space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-charcoal/40">
            <span>{post.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" strokeWidth={1.5} />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-headline text-3xl md:text-4xl font-medium text-charcoal leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 pt-1">
            <img
            src={post.author.avatarUrl || defaultAvatar}
              alt={post.author.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="text-sm">
              <span className="text-charcoal">{post.author.name}</span>
              <span className="text-charcoal/40"> · {post.date}</span>
            </div>
          </div>
        </header>

        {/* Featured cover image if present */}
        {post.imageUrl && (
          <div className="overflow-hidden bg-primary-container/30">
            <img
              src={post.imageUrl}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale-[15%]"
            />
          </div>
        )}

        {/* Formatted body HTML contents */}
        <div
          className="prose prose-neutral max-w-none font-sans text-base leading-relaxed text-charcoal/80 prose-headings:font-headline prose-headings:font-medium prose-headings:text-charcoal prose-a:text-primary prose-strong:text-charcoal"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Copyable code block display */}
        {post.codeBlock && (
          <div>
            <div className="flex justify-between items-center bg-charcoal text-white/70 px-4 py-2.5 font-mono text-xs">
              <span>
                {post.codeBlock.filename} ({post.codeBlock.language})
              </span>
              <button
                onClick={() => handleCopyCode(post.codeBlock!.code)}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-[#1e2023] text-[#f1f1ef] p-5 overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre">
              {post.codeBlock.code}
            </pre>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="font-mono text-xs bg-primary-container text-primary px-2 py-1 rounded-sm"
            >
              #{tag.toLowerCase()}
            </span>
          ))}
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-6 pt-6 border-t border-charcoal/10 text-sm text-charcoal/50">
          <button
            onClick={handleLikeClick}
            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${liked ? "fill-primary text-primary" : ""}`}
              strokeWidth={1.5}
            />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
            title={bookmarked ? "Saved" : "Bookmark"}
          >
            <Bookmark
              className={`w-4 h-4 ${bookmarked ? "fill-primary text-primary" : ""}`}
              strokeWidth={1.5}
            />
          </button>

          <button
            onClick={handleShareClick}
            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
            title="Copy share link"
          >
            {shareCopied ? (
              <>
                <Check className="w-4 h-4" strokeWidth={1.5} />
                <span>Copied</span>
              </>
            ) : (
              <Share2 className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </article>

      {/* Recommended posts */}
      {recommendedPosts.length > 0 && (
        <section className="pt-6 border-t border-charcoal/10 space-y-5">
          <h2 className="font-headline text-sm uppercase tracking-[0.2em] text-charcoal/40">
            Recommended
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recommendedPosts.map((recPost: Post) => (
              <Link
                key={recPost.id}
                to="/posts/$postId"
                params={{ postId: recPost.id }}
                className="group space-y-2"
              >
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-charcoal/40">
                  <span>{recPost.category}</span>
                  <span>{recPost.readTime}</span>
                </div>
                <h3 className="font-headline font-medium text-lg text-charcoal group-hover:text-primary transition-colors">
                  {recPost.title}
                </h3>
                <p className="font-sans text-sm text-charcoal/60 line-clamp-2">
                  {recPost.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
