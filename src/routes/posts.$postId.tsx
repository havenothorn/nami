/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { mockPosts } from "../data";
import { NotFound } from "../NotFound";
import {
  ArrowLeft,
  Clock,
  Share2,
  Clipboard,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Post, PostLanguage } from "../types";
import defaultAvatar from "../assets/profile.jpg";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$postId",
  component: PostDetailPage,
});

function PostDetailPage() {
  const { postId } = Route.useParams();
  const navigate = useNavigate();

  // Find current post by postId
  const post = mockPosts.find((p: Post) => p.id === postId);

  // States
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [language, setLanguage] = useState<PostLanguage>("en");

  // Reset transient copy feedback when navigating between posts
  useEffect(() => {
    setCopied(false);
    setShareCopied(false);
  }, [postId]);

  if (!post) {
    return (
      <NotFound
        title="Post Not Found!"
        message="Oops! The post you're looking for can't be found or has been moved."
      />
    );
  }

  const translation =
    post.translations[language] ??
    post.translations.en ??
    post.translations.ko;
  const availableLanguages = (["en", "ko"] as const).filter(
    (option) => post.translations[option],
  );

  // Handle source copying
  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-charcoal/40">
              <span>{post.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" strokeWidth={1.5} />
                {translation?.readTime ?? post.readTime}
              </span>
            </div>
            {availableLanguages.length > 1 && (
              <div
                className="inline-flex rounded-sm border border-charcoal/10 p-0.5 text-xs font-mono"
                role="group"
                aria-label="Article language"
              >
                {availableLanguages.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-label={option === "en" ? "English" : "한국어"}
                    aria-pressed={language === option}
                    onClick={() => setLanguage(option)}
                    className={`rounded-sm px-2.5 py-1 transition-colors cursor-pointer ${
                      language === option
                        ? "bg-primary text-white"
                        : "text-charcoal/50 hover:text-primary"
                    }`}
                  >
                    {option === "en" ? "EN" : "한국어"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <h1 className="font-headline text-3xl md:text-4xl font-medium text-charcoal leading-tight">
            {translation?.title ?? post.title}
          </h1>

          <div className="flex items-center gap-3 pt-1">
            <img
            src={post.author.avatarUrl || defaultAvatar}
              alt={post.author.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
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
              alt={translation?.title ?? post.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover grayscale-[15%]"
            />
          </div>
        )}

        {/* Formatted body HTML contents */}
        <div
          className="prose prose-neutral max-w-none font-sans text-base md:text-lg leading-[1.85] text-charcoal/80 prose-headings:font-headline prose-headings:font-medium prose-headings:text-charcoal prose-a:text-primary prose-strong:text-charcoal"
          dangerouslySetInnerHTML={{ __html: translation?.content ?? post.content }}
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
            <button
              key={tag}
              type="button"
              onClick={() =>
                void navigate({ to: "/explore", search: { q: tag } })
              }
              className="font-mono text-sm bg-primary-container text-primary px-2.5 py-1.5 rounded-sm hover:bg-primary-container/70 transition-colors cursor-pointer"
            >
              #{tag.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Share */}
        <div className="flex items-center pt-6 border-t border-charcoal/10 text-sm text-charcoal/50">
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

      <GiscusComments />

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

function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.getElementById("site-root");
    if (!root) return;

    const updateTheme = () => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.repo = "havenothorn/myDashboard";
    script.dataset.repoId = "R_kgDOKKW_hg";
    script.dataset.category = "General";
    script.dataset.categoryId = "DIC_kwDOKKW_hs4DJQL6";
    script.dataset.mapping = "pathname";
    script.dataset.strict = "0";
    script.dataset.reactionsEnabled = "1";
    script.dataset.emitMetadata = "0";
    script.dataset.inputPosition = "top";
    script.dataset.theme = theme;
    script.dataset.lang = "en";
    script.dataset.loading = "lazy";

    container.replaceChildren(script);
    return () => container.replaceChildren();
  }, [theme]);

  return (
    <section className="border-t border-charcoal/10 pt-8 space-y-5">
      <h2 className="font-headline text-sm uppercase tracking-[0.2em] text-charcoal/40">
        Comments &amp; reactions
      </h2>
      <div ref={containerRef} />
    </section>
  );
}
