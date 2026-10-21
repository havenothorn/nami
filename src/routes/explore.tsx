/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { mockPosts } from "../data";
import { PostCategory } from "../types";
import { Search, Clock, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  validateSearch: (search: Record<string, unknown>) =>
    typeof search.q === "string" ? { q: search.q } : {},
  component: ExplorePage,
});

const CATEGORIES: (PostCategory | "All")[] = [
  "All",
  "Essays",
  "Development",
  "Movies",
];

function ExplorePage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const [searchQuery, setSearchQuery] = useState(q ?? "");
  const [selectedCategory, setSelectedCategory] = useState<
    PostCategory | "All"
  >("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setSearchQuery(q ?? "");
  }, [q]);

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
    void navigate({ search: { q: "" } });
  };

  const hasActiveFilters =
    selectedCategory !== "All" || selectedTag || searchQuery;

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="space-y-3 max-w-2xl">
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal/40">
          Archive
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-medium text-charcoal">
          Explore
        </h1>
        <p className="font-sans text-sm md:text-base text-charcoal/60">
          Search posts or filter by category and tag.
        </p>
      </div>

      {/* Search */}
      <div className="relative border-b border-charcoal/15 focus-within:border-primary transition-colors">
        <Search
          className="absolute left-0 top-1/2 -translate-y-1/2 text-charcoal/40 w-4 h-4"
          strokeWidth={1.5}
        />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent pl-7 pr-8 py-3 text-charcoal text-base placeholder-charcoal/35 outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-charcoal/10 pb-5">
        {CATEGORIES.map((category) => {
          const count =
            category === "All"
              ? mockPosts.length
              : mockPosts.filter((p) => p.category === category).length;
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`font-headline text-sm tracking-wide pb-1 border-b transition-colors cursor-pointer ${
                isSelected
                  ? "text-primary border-primary"
                  : "text-charcoal/40 border-transparent hover:text-primary"
              }`}
            >
              {category} <span className="text-xs">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <span className="font-mono text-xs uppercase tracking-wider text-charcoal/40 mr-1">
          Tags:
        </span>
        {allTags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(isSelected ? null : tag)}
              className={`font-mono text-xs px-2 py-1 rounded-sm transition-colors cursor-pointer ${
                isSelected
                  ? "bg-primary text-white"
                  : "bg-primary-container text-primary hover:bg-primary-container/60"
              }`}
            >
              #{tag.toLowerCase()}
            </button>
          );
        })}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ml-auto text-xs text-charcoal/40 hover:text-charcoal underline underline-offset-4 transition-colors cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Results */}
      <div className="text-sm text-charcoal/40">
        {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"} found
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 border-t border-charcoal/10 pt-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              to="/posts/$postId"
              params={{ postId: post.id }}
              className="group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-charcoal/40">
                  <span>{post.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" strokeWidth={1.5} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-headline font-medium text-xl text-charcoal group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="font-sans text-sm text-charcoal/60 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTag(selectedTag === tag ? null : tag);
                      }}
                      className="font-mono text-xs bg-primary-container text-primary px-2 py-1 rounded-sm hover:bg-primary-container/60 transition-colors cursor-pointer"
                    >
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-charcoal/40">
                <span>{post.author.name}</span>
                <span>{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3 border-t border-charcoal/10">
          <h3 className="font-headline text-xl font-medium text-charcoal">
            No posts found
          </h3>
          <p className="font-sans text-sm text-charcoal/50 max-w-sm mx-auto">
            Try resetting your filters or searching a different keyword.
          </p>
          <button
            onClick={resetFilters}
            className="text-sm text-charcoal border-b border-charcoal pb-0.5 hover:text-charcoal/60 hover:border-charcoal/60 transition-colors cursor-pointer"
          >
            Show all posts
          </button>
        </div>
      )}
    </div>
  );
}
