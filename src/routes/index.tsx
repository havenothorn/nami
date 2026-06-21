/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoute, Link } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { mockPosts } from "../data";
import {
  BookOpen,
  Sparkles,
  Flame,
  Clock,
  Heart,
  ArrowRight,
  CornerDownRight,
  Check,
  Send,
} from "lucide-react";
import { useState, FormEvent } from "react";
import type { Post } from "../types";
import { motion } from "motion/react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

function HomePage() {
  const [newsEmail, setNewsEmail] = useState("");
  const [success, setSuccess] = useState(false);

  // Featured post is "whimsy-components" (latest published)
  const featuredPost =
    mockPosts.find((p: Post) => p.id === "whimsy-components") || mockPosts[0];

  // Recent posts list includes everything except the featured post
  const recentPosts = mockPosts
    .filter((p: Post) => p.id !== featuredPost.id)
    .slice(0, 3);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNewsEmail("");
      }, 3000);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Cozy Intro Greeting Panel */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-primary-container border-[3px] border-charcoal rounded-2xl p-6 md:p-8 hard-shadow-secondary overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-secondary-container rounded-bl-full opacity-35 pointer-events-none" />
        <div className="absolute bottom-4 right-[20%] hidden md:block opacity-10">
          <BookOpen className="w-48 h-48 rotate-12" />
        </div>

        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-card border-2 border-charcoal rounded-full text-xs font-mono font-bold uppercase tracking-wider text-primary">
            <Sparkles className="w-3.5 h-3.5 text-secondary fill-secondary-container" />
            Introduction
          </div>
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-charcoal leading-tight">
            Hi, I'm Nami. Welcome to my{" "}
            <span className="underline decoration-dashed decoration-secondary decoration-4 underline-offset-4">
              corner of the Web.
            </span>
            .
          </h1>
          <p className="font-sans text-base md:text-lg text-charcoal/80 leading-relaxed">
            This is a cozy little log where I share my thoughts, essays, and
            tutorials about frontend development, design patterns, and the art
            of crafting delightful user experiences. Pull up a chair, grab a cup
            of tea, and let's explore the world of code together.
          </p>

          {/* Quick Stats Counter Row */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-surface-card border-2 border-charcoal px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="w-4.5 h-4.5 text-primary" />
              <span>{mockPosts.length} posts</span>
            </div>
            <div className="bg-surface-card border-2 border-charcoal px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold">
              <Flame className="w-4.5 h-4.5 text-secondary fill-secondary-container" />
              <span>Cozy Streak: 15 Days</span>
            </div>
            <div className="bg-surface-card border-2 border-charcoal px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold">
              <span className="font-mono text-xs text-primary font-bold bg-primary-container border border-primary/20 px-1 rounded">
                100%
              </span>
              <span className="text-xs">Organically Structured</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. Featured Article */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-headline font-bold text-2xl text-charcoal">
          <BookOpen className="w-6 h-6 text-primary fill-primary-container" />
          <h2>Featured Post</h2>
          <div className="h-[2px] bg-charcoal/10 flex-grow rounded" />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-surface-card border-[3px] border-charcoal rounded-2xl overflow-hidden hard-shadow hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(45,104,92,1)] transition-all flex flex-col lg:flex-row group"
        >
          {/* Image side */}
          {featuredPost.imageUrl && (
            <div className="lg:w-1/2 min-h-[250px] lg:min-h-[400px] relative border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-charcoal overflow-hidden bg-primary-container/20">
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-tertiary-container text-tertiary border-2 border-charcoal px-3 py-1.5 rounded-lg font-mono text-xs font-bold hard-shadow-sm">
                FEATURED ESSAY
              </div>

              {featuredPost.engagementScore && (
                <div className="absolute bottom-4 right-4 bg-secondary-container text-secondary border-2 border-charcoal px-3 py-1.5 rounded-lg font-headline font-bold text-xs hard-shadow-sm flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-secondary-container" />
                  {featuredPost.engagementScore}
                </div>
              )}
            </div>
          )}

          {/* Text Content side */}
          <div className="lg:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {featuredPost.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="font-mono text-xs font-semibold px-2 py-1 bg-bg-soft border-2 border-charcoal rounded-md"
                  >
                    #{tag.toLowerCase()}
                  </span>
                ))}
              </div>

              <h3 className="font-headline text-2xl md:text-3xl font-bold text-charcoal leading-snug group-hover:text-primary transition-colors">
                <Link
                  to={"/posts/$postId" as any}
                  params={{ postId: featuredPost.id } as any}
                >
                  {featuredPost.title}
                </Link>
              </h3>

              <p className="font-sans text-sm md:text-base text-charcoal/80 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-charcoal/10 flex items-center justify-between">
              {/* Author details */}
              <div className="flex items-center gap-3">
                <img
                  src={featuredPost.author.avatarUrl}
                  alt={featuredPost.author.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border-2 border-charcoal object-cover"
                />
                <div>
                  <h4 className="font-headline font-semibold text-sm text-charcoal leading-none">
                    {featuredPost.author.name}
                  </h4>
                  <span className="font-sans text-xs text-charcoal/50">
                    {featuredPost.date} • {featuredPost.readTime}
                  </span>
                </div>
              </div>

              {/* View details CTA button */}
              <Link
                to={"/posts/$postId" as any}
                params={{ postId: featuredPost.id } as any}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-primary border-2 border-charcoal rounded-lg font-headline font-bold text-sm hover:bg-primary hover:text-white transition-all hover:translate-x-[-1px] active:translate-x-[1px]"
              >
                Read details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Recent Posts List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-headline font-bold text-2xl text-charcoal">
            <h2>Recent Posts</h2>
            <div className="h-[2px] bg-charcoal/10 w-24 rounded" />
          </div>

          <Link
            to="/explore"
            className="text-primary font-headline font-bold text-sm flex items-center gap-1 group hover:underline decoration-2 underline-offset-4"
          >
            See all posts
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post: Post, idx: number) => (
            <motion.article
              key={post.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + idx * 0.08, duration: 0.4 }}
              className="bg-surface-card border-[3px] border-charcoal rounded-xl overflow-hidden hard-shadow-secondary hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_rgba(136,77,84,1)] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Micro Category Tag and header */}
                <div className="p-4 bg-primary-container/25 border-b-2 border-charcoal flex justify-between items-center">
                  <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-primary-container bg-primary border-2 border-charcoal px-2 py-0.5 rounded">
                    {post.category}
                  </span>

                  <span className="text-xs font-sans text-charcoal/60 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-charcoal/60"
                      >
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-headline font-bold text-lg md:text-xl text-charcoal group-hover:text-primary transition-colors leading-snug">
                    <Link
                      to={"/posts/$postId" as any}
                      params={{ postId: post.id } as any}
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="font-sans text-xs md:text-sm text-charcoal/70 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t-2 border-dashed border-charcoal/10 flex items-center justify-between">
                <span className="font-sans text-xs text-charcoal/50">
                  {post.date}
                </span>

                <Link
                  to={"/posts/$postId" as any}
                  params={{ postId: post.id } as any}
                  className="w-8 h-8 rounded-full border-2 border-charcoal flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  title="Post details"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 4. Newsletter Card */}
      <section className="bg-tertiary-container text-on-tertiary-container border-[3px] border-charcoal rounded-2xl p-6 md:p-8 hard-shadow-tertiary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-surface-card rounded-bl-full border-b-[3px] border-l-[3px] border-charcoal opacity-15 pointer-events-none" />

        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1 text-sm font-mono uppercase font-bold tracking-wider text-tertiary">
            <CornerDownRight className="w-4 h-4" />
            Newsletter
          </div>
          <h2 className="font-headline text-2xl md:text-3xl font-black">
            Never miss new posts and essays.
          </h2>
          <p className="font-sans text-sm md:text-base leading-relaxed opacity-90">
            I write deep articles about frontend techniques, clean layouts,
            custom state management tools, and other delightful developer design
            patterns.
          </p>

          <div className="pt-2">
            {success ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface-card text-primary border-2 border-charcoal p-3.5 rounded-lg flex items-center gap-2 font-headline font-bold shadow-sm"
              >
                <Check className="w-5 h-5 text-emerald-600 font-bold" />
                Thanks — check your inbox soon for updates.
              </motion.div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  className="flex-grow bg-white border-2 border-charcoal text-charcoal rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/25 font-sans shadow-inner text-sm"
                />
                <button
                  type="submit"
                  className="bg-charcoal text-white font-headline font-bold px-6 py-2.5 rounded-lg border-2 border-charcoal hover:hard-shadow-charcoal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(99,87,135,1)] hover:bg-charcoal/90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
