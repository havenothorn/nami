/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoute, Link } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { mockPosts } from "../data";
import { Clock, ArrowRight, Eye } from "lucide-react";
import type { Post } from "../types";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import { onValue, ref } from "firebase/database";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

function HomePage() {
  const [today] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [dailyVisitors, setDailyVisitors] = useState<number | null>(null);
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);
  const [visitorsUnavailable, setVisitorsUnavailable] = useState(false);

  useEffect(() => {
    const unsubscribeDaily = onValue(
      ref(database, `dailyUniqueVisitors/${today}`),
      (snapshot) => {
        setDailyVisitors(snapshot.exists() ? (snapshot.val() as number) : 0);
        setVisitorsUnavailable(false);
      },
      () => setVisitorsUnavailable(true),
    );
    const unsubscribeTotal = onValue(
      ref(database, "totalUniqueVisitors"),
      (snapshot) => {
        setTotalVisitors(snapshot.exists() ? (snapshot.val() as number) : 0);
        setVisitorsUnavailable(false);
      },
      () => setVisitorsUnavailable(true),
    );

    return () => {
      unsubscribeDaily();
      unsubscribeTotal();
    };
  }, [today]);

  // Featured post is "whimsy-components" (latest published)
  const featuredPost =
    mockPosts.find((p: Post) => p.id === "whimsy-components") || mockPosts[0];

  // Recent posts list includes everything except the featured post
  const recentPosts = mockPosts
    .filter((p: Post) => p.id !== featuredPost.id)
    .slice(0, 3);

  return (
    <div className="space-y-20">
      {/* 1. Intro */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl space-y-5"
      >
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal/40">
          Introduction
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-medium text-charcoal leading-[1.1]">
          Hi, I'm Nami. Welcome to my corner of the web.
        </h1>
        <p className="font-sans text-base text-charcoal/70 leading-relaxed">
          This is a small log where I write about frontend development, the
          films I watch, and everyday things worth writing down.
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-charcoal/40">
          <span>{mockPosts.length} posts published</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" strokeWidth={1.5} />
            {visitorsUnavailable
              ? "Visits unavailable"
              : totalVisitors === null || dailyVisitors === null
                ? "Loading visitor counts…"
                : `${totalVisitors.toLocaleString()} total visitors · ${dailyVisitors.toLocaleString()} today`}
          </span>
        </div>
      </motion.section>

      {/* 2. Featured Article */}
      <section className="space-y-5">
        <h2 className="font-headline text-sm uppercase tracking-[0.2em] text-charcoal/40">
          Featured
        </h2>

        <Link
          to="/posts/$postId"
          params={{ postId: featuredPost.id }}
          className="group grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 border-t border-charcoal/10 pt-6"
        >
          {featuredPost.imageUrl && (
            <div className="min-h-[220px] lg:min-h-[340px] overflow-hidden bg-primary-container/40">
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale-[15%] transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          )}

          <div className="flex flex-col justify-center space-y-4">
            <div className="flex flex-wrap gap-2 text-xs font-mono uppercase tracking-wider text-primary">
              {featuredPost.tags.map((tag: string) => (
                <span key={tag} className="bg-primary-container px-2 py-1 rounded-sm">
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>

            <h3 className="font-headline text-2xl md:text-3xl font-medium text-charcoal leading-snug group-hover:text-primary transition-colors">
              {featuredPost.title}
            </h3>

            <p className="font-sans text-sm md:text-base text-charcoal/60 leading-relaxed line-clamp-3">
              {featuredPost.excerpt}
            </p>

            <div className="flex items-center justify-between pt-2 text-sm text-charcoal/40">
              <span>
                {featuredPost.author.name} · {featuredPost.date} ·{" "}
                {featuredPost.readTime}
              </span>
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </Link>
      </section>

      {/* 3. Recent Posts List */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-sm uppercase tracking-[0.2em] text-charcoal/40">
            Recent Posts
          </h2>

          <Link
            to="/explore"
            className="text-sm text-charcoal/50 hover:text-primary flex items-center gap-1 group transition-colors"
          >
            See all
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-charcoal/10 pt-6">
          {recentPosts.map((post: Post) => (
            <Link
              key={post.id}
              to="/posts/$postId"
              params={{ postId: post.id }}
              className="group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-charcoal/40">
                  <span>{post.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" strokeWidth={1.5} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-headline font-medium text-lg text-charcoal group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="font-sans text-sm text-charcoal/60 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <span className="font-sans text-xs text-charcoal/40">
                {post.date}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
