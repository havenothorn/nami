/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoute, Link } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { mockPosts } from "../data";
import { PostCategory } from "../types";
import {
  Search,
  Sparkles,
  BookOpen,
  Terminal,
  Code,
  Filter,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "motion/react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: ExplorePage,
});

function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    PostCategory | "All"
  >("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Derive unique tags from the dataset
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    mockPosts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, []);

  // Filter posts dynamically in client memory
  const filteredPosts = useMemo(() => {
    return mockPosts.filter((post) => {
      // 1. Category Filter
      if (selectedCategory !== "All" && post.category !== selectedCategory) {
        return false;
      }
      // 2. Tag Filter
      if (selectedTag && !post.tags.includes(selectedTag)) {
        return false;
      }
      // 3. Search Query text check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
        const matchesTags = post.tags.some((t) =>
          t.toLowerCase().includes(query),
        );
        const matchesCategory = post.category.toLowerCase().includes(query);
        return matchesTitle || matchesExcerpt || matchesTags || matchesCategory;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedTag]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedTag(null);
  };

  return (
    <div className="space-y-10">
      {/* Page Title & Soft Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-tertiary-container text-tertiary border-2 border-charcoal rounded-full text-xs font-mono font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          The Archives
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-black text-charcoal">
          Explore Collections
        </h1>
        <p className="font-sans text-sm md:text-base text-charcoal/70 max-w-2xl">
          Search posts, deep concepts, design tokens, and reference snippets.
          Use search phrases, toggle categories, or select tags to filter
          results.
        </p>
      </div>

      {/* Modern Search Hub */}
      <section className="bg-surface-card border-[3px] border-charcoal rounded-2xl p-5 md:p-6 hard-shadow-secondary space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Type terms to search (e.g. 'hooks', 'CSS', 'Memo', 'Why')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-soft border-2 border-charcoal rounded-xl pl-12 pr-4 py-3.5 text-charcoal font-semibold text-base placeholder-charcoal/50 outline-none focus:ring-2 focus:ring-primary/25 transition-all text-ellipsis"
          />
          <Search className="absolute left-4 top-4 text-charcoal/70 w-5 h-5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-4 text-charcoal/60 hover:text-charcoal font-bold text-sm cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tag Filters list */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-mono text-xs font-bold text-charcoal/60 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            FILTER TAGS:
          </span>
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`font-mono text-xs px-2.5 py-1 rounded border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-secondary text-white border-charcoal translate-y-[-1px] shadow-[2px_2px_0px_0px_rgba(45,104,92,1)]"
                    : "bg-bg-soft text-charcoal/80 border-charcoal/30 hover:border-charcoal hover:translate-y-[-1px]"
                }`}
              >
                #{tag.toLowerCase()}
              </button>
            );
          })}
        </div>
      </section>

      {/* Category Grid Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card All */}
        <button
          onClick={() => setSelectedCategory("All")}
          className={`text-left p-4 rounded-xl border-[3px] border-charcoal transition-all bouncy-hover cursor-pointer flex flex-col justify-between ${
            selectedCategory === "All"
              ? "bg-primary-container text-primary-container-foreground hard-shadow"
              : "bg-surface-card hover:bg-bg-soft shadow-inner"
          }`}
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-lg border-2 border-charcoal bg-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-headline font-bold text-lg mt-2 leading-tight">
              All Posts
            </h3>
            <p className="text-xs text-charcoal/70">
              Show whole catalog entries
            </p>
          </div>
          <span className="font-mono text-xs font-bold mt-4 uppercase">
            {mockPosts.length} posts
          </span>
        </button>

        {/* Card Essays */}
        <button
          onClick={() => setSelectedCategory("Essays")}
          className={`text-left p-4 rounded-xl border-[3px] border-charcoal transition-all bouncy-hover cursor-pointer flex flex-col justify-between ${
            selectedCategory === "Essays"
              ? "bg-secondary-container hard-shadow-secondary"
              : "bg-surface-card hover:bg-bg-soft"
          }`}
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-lg border-2 border-charcoal bg-white flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-headline font-bold text-lg mt-2 leading-tight">
              Essays & Ideas
            </h3>
            <p className="text-xs text-charcoal/70">Reflective tech thoughts</p>
          </div>
          <span className="font-mono text-xs font-bold mt-4 uppercase">
            {mockPosts.filter((p) => p.category === "Essays").length} articles
          </span>
        </button>

        {/* Card Tutorials */}
        <button
          onClick={() => setSelectedCategory("Tutorials")}
          className={`text-left p-4 rounded-xl border-[3px] border-charcoal transition-all bouncy-hover cursor-pointer flex flex-col justify-between ${
            selectedCategory === "Tutorials"
              ? "bg-tertiary-container hard-shadow-tertiary"
              : "bg-surface-card hover:bg-bg-soft"
          }`}
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-lg border-2 border-charcoal bg-white flex items-center justify-center">
              <Terminal className="w-5 h-5 text-tertiary" />
            </div>
            <h3 className="font-headline font-bold text-lg mt-2 leading-tight">
              Guides & Tutorials
            </h3>
            <p className="text-xs text-charcoal/70">Hands-on code walks</p>
          </div>
          <span className="font-mono text-xs font-bold mt-4 uppercase">
            {mockPosts.filter((p) => p.category === "Tutorials").length} modules
          </span>
        </button>

        {/* Card Snippets */}
        <button
          onClick={() => setSelectedCategory("Snippets")}
          className={`text-left p-4 rounded-xl border-[3px] border-charcoal transition-all bouncy-hover cursor-pointer flex flex-col justify-between ${
            selectedCategory === "Snippets"
              ? "bg-emerald-100 hard-shadow-lavender"
              : "bg-surface-card hover:bg-bg-soft"
          }`}
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-lg border-2 border-charcoal bg-white flex items-center justify-center">
              <Code className="w-5 h-5 text-emerald-800" />
            </div>
            <h3 className="font-headline font-bold text-lg mt-2 leading-tight">
              Code Snippets
            </h3>
            <p className="text-xs text-charcoal/70">Copyable code blocks</p>
          </div>
          <span className="font-mono text-xs font-bold mt-4 uppercase">
            {mockPosts.filter((p) => p.category === "Snippets").length} snippets
          </span>
        </button>
      </section>

      {/* Listing Status and Reset Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="font-headline font-bold text-xl text-charcoal flex items-center gap-2">
          <span>Results for filter</span>
          <span className="px-2 py-0.5 bg-bg-soft border border-charcoal/20 text-xs rounded font-mono font-bold text-primary">
            {selectedCategory}
          </span>
          {selectedTag && (
            <span className="px-2 py-0.5 bg-bg-soft border border-charcoal/20 text-xs rounded font-mono font-bold text-secondary">
              #{selectedTag}
            </span>
          )}
          <span className="text-sm font-sans font-medium text-charcoal/50">
            ({filteredPosts.length} posts found)
          </span>
        </h2>

        {(selectedCategory !== "All" || selectedTag || searchQuery) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-mono font-bold text-secondary-container bg-secondary border-2 border-charcoal px-2.5 py-1 rounded hover:translate-y-[-1px] transition-transform shadow-[2px_2px_0px_0px_rgba(45,104,92,1)] cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            RESET FILTERS
          </button>
        )}
      </div>

      {/* Dynamic Results Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              layout
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-surface-card border-[3px] border-charcoal rounded-xl overflow-hidden hard-shadow hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_rgba(45,104,92,1)] transition-all flex flex-col justify-between group"
            >
              <div className="p-5 md:p-6 space-y-4">
                {/* Meta details */}
                <div className="flex justify-between items-center text-xs font-mono">
                  <span
                    className={`px-2 py-0.5 border-2 border-charcoal rounded font-extrabold tracking-wider ${
                      post.category === "Essays"
                        ? "bg-secondary-container text-secondary"
                        : post.category === "Tutorials"
                          ? "bg-tertiary-container text-tertiary"
                          : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="text-charcoal/60 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                {/* Cover representation (only tiny if present or no thumbnail) */}
                <div className="space-y-2">
                  <h3 className="font-headline font-black text-xl md:text-2xl text-charcoal group-hover:text-primary transition-colors leading-tight">
                    <Link
                      to="/posts/$postId"
                      params={{ postId: post.id }}
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Subtag list */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag(selectedTag === tag ? null : tag);
                      }}
                      className="font-mono text-xs px-2 py-0.5 bg-bg-soft border border-charcoal/20 hover:border-charcoal hover:bg-primary-container/20 transition-all rounded cursor-pointer"
                    >
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar inside card */}
              <div className="p-5 pt-0 border-t-2 border-dashed border-charcoal/10 flex items-center justify-between bg-bg-soft/30">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full border border-charcoal object-cover"
                  />
                  <span className="font-headline text-xs font-bold text-charcoal/80">
                    {post.author.name}
                  </span>
                </div>

                <span className="font-sans text-xs text-charcoal/50">
                  {post.date}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-12 bg-white border-2 border-dashed border-charcoal/40 rounded-xl space-y-3"
        >
          <div className="inline-block p-3 bg-secondary-container rounded-full border-2 border-charcoal text-secondary">
            ✕
          </div>
          <h3 className="font-headline text-xl font-bold">No posts found</h3>
          <p className="font-sans text-sm text-charcoal/60 max-w-sm mx-auto">
            Try resetting your filters, search queries, or checking for other
            search keywords like "React" or "CSS".
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 bg-primary text-white font-headline font-bold px-4 py-2 border-2 border-charcoal rounded-lg hover:shadow-sm"
          >
            Show All Posts
          </button>
        </motion.div>
      )}
    </div>
  );
}
