/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoute, Link } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { mockPosts } from "../data";
import {
  ArrowLeft,
  Clock,
  Share2,
  Clipboard,
  Check,
  Heart,
  Bookmark,
  CornerDownRight,
  Sparkles,
  BookOpen,
  Send,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import type { Post } from "../types";

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
  const [likesCount, setLikesCount] = useState(42);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<
    Array<{ name: string; text: string; date: string }>
  >([
    {
      name: "Chloe Miller",
      text: "This represents exactly what I needed this morning. Code needs much more empathy indeed! Thanks, Nami.",
      date: "3 hours ago",
    },
    {
      name: "Hasan Patel",
      text: "The calculator.js visual code example is pristine. Absolute joy to read and study.",
      date: "1 day ago",
    },
  ]);

  // Reset likes count on load/change
  useEffect(() => {
    // Generate deterministic seed based on postId for demo variance
    const detSeed = postId.charCodeAt(0) + (postId.charCodeAt(1) || 0);
    setLikesCount((detSeed % 50) + 20);
    setLiked(false);
    setBookmarked(false);
  }, [postId]);

  if (!post) {
    return (
      <div className="text-center py-16 space-y-6 max-w-md mx-auto">
        <div className="inline-flex p-4 bg-secondary-container text-secondary rounded-full border-2 border-charcoal">
          <AlertTriangle className="w-10 h-10 animate-bounce" />
        </div>
        <h1 className="font-headline text-3xl font-black text-charcoal">
          Post Not Found!
        </h1>
        <p className="font-sans text-sm text-charcoal/70">
          Oops! The post you're looking for can't be found or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white border-2 border-charcoal rounded-lg font-headline font-bold hover:bg-primary/95 transition-all outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
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

  // Handle social share mock action
  const handleShareClick = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert(
      `Copied article URL to clipboard:\n${shareUrl}\n\nGo share the cozy bytes!`,
    );
  };

  // Handle Comment submissions
  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      setComments((prev) => [
        {
          name: "Anonymous Reader",
          text: commentInput.trim(),
          date: "Just now",
        },
        ...prev,
      ]);
      setCommentInput("");
    }
  };

  // Fetch Recommended posts
  const recommendedPosts = mockPosts.filter((p: Post) =>
    post.recommendedPostIds.includes(p.id),
  );

  return (
    <div className="space-y-10">
      {/* Back Button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-charcoal rounded-lg font-headline font-bold text-sm text-charcoal hover:bg-primary-container hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </Link>
      </div>

      {/* Main Core Article layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Core content (8 cols) */}
        <article className="lg:col-span-8 bg-surface-card border-[3px] border-charcoal rounded-2xl overflow-hidden hard-shadow p-6 md:p-8 space-y-8">
          {/* Header Metadata */}
          <header className="space-y-4 pb-6 border-b-2 border-charcoal">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <span className="font-mono text-xs font-bold bg-primary-container text-primary border-2 border-charcoal px-2.5 py-1 rounded">
                Category: {post.category.toUpperCase()}
              </span>

              <div className="flex items-center gap-1 text-xs font-mono text-charcoal/60">
                <Clock className="w-4 h-4" />
                <span>Published on {post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>

            <h1 className="font-headline text-3xl md:text-5.5xl font-black text-charcoal leading-tight">
              {post.title}
            </h1>

            {/* Dynamic engagement indicator */}
            {post.engagementScore && (
              <div className="inline-flex items-center gap-1.5 bg-secondary-container text-secondary border-[2px] border-charcoal px-2.5 py-1 rounded-md text-xs font-headline font-bold shadow-sm">
                <Sparkles
                  className="w-3.5 h-3.5 text-secondary fill-secondary-container animate-spin"
                  style={{ animationDuration: "6s" }}
                />
                <span>Engagement: {post.engagementScore}</span>
              </div>
            )}
          </header>

          {/* Featured cover image if present */}
          {post.imageUrl && (
            <div className="rounded-xl border-2 border-charcoal overflow-hidden relative max-h-[350px] md:max-h-[420px]">
              <img
                src={post.imageUrl}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Formatted body HTML contents */}
          <div
            className="prose prose-stone max-w-none font-sans text-base leading-relaxed text-charcoal/90 space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Copyable code block display */}
          {post.codeBlock && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-charcoal text-white/90 border-t-2 border-l-2 border-r-2 border-charcoal rounded-t-xl px-4 py-2.5 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary-container" />
                  <span>
                    {post.codeBlock.filename} ({post.codeBlock.language})
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(post.codeBlock!.code)}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#475569] border border-[#64748b] rounded text-xs font-bold hover:bg-primary hover:border-charcoal transition-all text-white cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Copy Source</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code text container */}
              <pre className="bg-[#1e293b] text-[#f8fafc] border-2 border-charcoal p-5 rounded-b-xl overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre shadow-inner">
                {post.codeBlock.code}
              </pre>
            </div>
          )}

          {/* Article Footer with interaction states */}
          <div className="pt-6 border-t-2 border-charcoal/10 flex flex-wrap justify-between items-center gap-4">
            {/* Tag List */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="font-mono text-xs bg-bg-soft border border-charcoal/20 px-2 py-0.5 rounded"
                >
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>

            {/* Quick Interactions Bar */}
            <div className="flex gap-2">
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-charcoal rounded-lg font-headline font-semibold text-sm transition-all cursor-pointer ${
                  liked
                    ? "bg-secondary-container text-secondary translate-y-[1px]"
                    : "bg-white hover:bg-bg-soft"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-secondary" : ""}`} />
                <span>{likesCount} Hearts</span>
              </button>

              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 border-2 border-charcoal rounded-lg text-sm transition-all cursor-pointer ${
                  bookmarked
                    ? "bg-primary-container text-primary"
                    : "bg-white hover:bg-bg-soft"
                }`}
                title={bookmarked ? "Saved" : "Bookmark"}
              >
                <Bookmark
                  className={`w-4 h-4 ${bookmarked ? "fill-primary" : ""}`}
                />
              </button>

              <button
                onClick={handleShareClick}
                className="p-2 border-2 border-charcoal rounded-lg text-sm bg-white hover:bg-bg-soft transition-all cursor-pointer"
                title="Copy share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Community Comment Section */}
          <div className="pt-6 border-t-2 border-charcoal/10 space-y-6">
            <h3 className="font-headline font-bold text-xl text-charcoal">
              Comments ({comments.length})
            </h3>

            {/* New Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <textarea
                placeholder="Write a thoughtful comment or a technical question..."
                required
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full bg-bg-soft border-2 border-charcoal/40 rounded-xl p-3 text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-charcoal/50 min-h-[80px]"
              />
              <button
                type="submit"
                className="bg-primary text-white font-headline font-bold px-4 py-2 border-2 border-charcoal rounded-lg hover:translate-y-[-1px] shadow-[2px_2px_0px_0px_#2d3436] transition-transform flex items-center gap-1.5 cursor-pointer text-sm"
              >
                <span>Post Comment</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Existing Comments listing */}
            <div className="space-y-4">
              {comments.map((cmt, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-bg-soft/40 border-2 border-charcoal/15 rounded-xl space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-headline font-black text-charcoal">
                      {cmt.name}
                    </span>
                    <span className="font-sans text-charcoal/40">
                      {cmt.date}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-charcoal/80 leading-relaxed">
                    {cmt.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Right Column: Author profile & dynamic recommendations widgets (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Author Capsule profile Card */}
          <div className="bg-primary-container border-[3px] border-charcoal rounded-2xl p-5 md:p-6 hard-shadow-secondary space-y-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary bg-white border border-primary/30 px-2 py-0.5 rounded">
              Digital Landscaper
            </span>

            <div className="flex items-center gap-4">
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full border-2 border-charcoal object-cover shadow-sm bg-white"
              />
              <div>
                <h3 className="font-headline font-black text-lg text-charcoal leading-none">
                  {post.author.name}
                </h3>
                <span className="font-sans text-xs text-charcoal/60">
                  {post.author.role}
                </span>
              </div>
            </div>

            <p className="font-sans text-xs md:text-sm text-charcoal/85 leading-relaxed bg-white/40 p-3 rounded-lg border border-charcoal/10">
              Welcome to my digital workspace! I love designing robust React
              containers, playing with custom spring systems, and curating
              peaceful software ecosystems.
            </p>

            <Link
              to="/about"
              className="block text-center text-xs font-headline font-black text-secondary uppercase tracking-wider bg-white border-2 border-charcoal py-2 rounded-lg hover:bg-secondary-container shadow-[2px_2px_0px_0px_#2d3436] hover:translate-y-[-1px] transition-all"
            >
              Know More About Nami
            </Link>
          </div>

          {/* Social share guidelines and community link */}
          <div className="bg-surface-card border-2 border-charcoal rounded-xl p-5 space-y-3">
            <h4 className="font-headline font-bold text-sm text-charcoal uppercase flex items-center gap-1">
              <CornerDownRight className="w-4 h-4 text-primary" />
              Share
            </h4>
            <p className="font-sans text-xs text-charcoal/60 leading-relaxed">
              If these posts sparked ideas, consider sharing them with
              colleagues.
            </p>
            <button
              onClick={handleShareClick}
              className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-bg-soft border-2 border-charcoal rounded-lg font-headline font-bold text-xs hover:bg-secondary-container hover:text-on-secondary-container transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Copy Share Link
            </button>
          </div>
        </aside>
      </div>

      {/* Recommended posts loop bottom panel */}
      {recommendedPosts.length > 0 && (
        <section className="pt-6 border-t-2 border-dashed border-charcoal/20 space-y-4">
          <div className="flex items-center gap-2 font-headline font-bold text-xl text-charcoal">
            <BookOpen className="w-5 h-5 text-secondary" />
            <h2>Recommended Reads</h2>
            <div className="h-[2px] bg-charcoal/10 flex-grow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedPosts.map((recPost: Post) => (
              <div
                key={recPost.id}
                className="bg-white border-2 border-charcoal p-5 rounded-xl hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(45,104,92,1)] transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-charcoal/55">
                    <span>{recPost.category.toUpperCase()}</span>
                    <span>{recPost.readTime}</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-charcoal group-hover:text-primary transition-colors">
                    <Link
                      to={"/posts/$postId" as any}
                      params={{ postId: recPost.id } as any}
                    >
                      {recPost.title}
                    </Link>
                  </h3>
                  <p className="font-sans text-xs text-charcoal/70 line-clamp-2">
                    {recPost.excerpt}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-dashed border-charcoal/10 flex justify-between items-center">
                  <span className="font-sans text-[10px] uppercase text-charcoal/40">
                    Published on {recPost.date}
                  </span>
                  <Link
                    to={"/posts/$postId" as any}
                    params={{ postId: recPost.id } as any}
                    className="text-xs font-headline font-bold text-primary flex items-center gap-1 group-hover:underline"
                  >
                    <span>Read post</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
