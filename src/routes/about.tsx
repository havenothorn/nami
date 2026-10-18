/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import type { ReactNode } from "react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

interface Tool {
  name: string;
  color: string;
}

const tools: Tool[] = [
  { name: "TypeScript 5.8", color: "#3178c6" },
  { name: "React 19", color: "#61dafb" },
  { name: "Tailwind CSS v4", color: "#38bdf8" },
  { name: "TanStack Router", color: "#10b981" },
  { name: "Motion", color: "#eab308" },
  { name: "Vite 8", color: "#646cff" },
];

const facts: { title: string; detail: ReactNode }[] = [
  {
    title: "Who I am",
    detail: (
      <div className="space-y-3 max-w-xl">
        <p className="text-charcoal underline decoration-primary/40 decoration-2 underline-offset-4">
          Front-end Engineer & Writer{" "}
          <em className="italic text-charcoal/60">
            (not professional, just my hobby)
          </em>
        </p>
        <p>
          I studied furniture design in college. After that, I tried many
          different jobs — an intern reporter, a teaching assistant in grad
          school, cleaning squid in a restaurant kitchen, serving tables,
          working in a shop, doing design, and building web pages — before
          finally becoming a developer.
        </p>
        <div className="space-y-1">
          <p>
            <span className="font-mono text-[12px] uppercase tracking-wider text-primary mr-2 bg-primary/10 p-1 rounded-sm">
              Input
            </span>
            All kinds of movies, reading and writing notes, and exploring
            culture alone
          </p>
          <p>
            <span className="font-mono text-[12px] uppercase tracking-wider text-primary mr-2 bg-primary/10 p-1 rounded-sm">
              Output
            </span>
            Conversations with loved ones, walking up Namsan, and practicing
            yoga
          </p>
        </div>
        <p>I write and make things based on ideas I get from everyday life.</p>
      </div>
    ),
  },
  {
    title: "Currently",
    detail: (
      <ul className="space-y-1 list-disc list-inside marker:text-primary/40">
        <li>
          Working as a developer at a healthcare company
          <br />
          <a
            href="https://www.linkedin.com/in/hui-jeong-nam-b5186919b/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block pl-5 text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary transition-colors"
          >
            Connect on LinkedIn ↗
          </a>
        </li>
        <li>Learning English every Saturday.</li>
        <li>
          Reading <em className="italic">To Have or to Be?</em>... by Erich
          Fromm.
        </li>
      </ul>
    ),
  },
  {
    title: "On repeat",
    detail: (
      <ul className="space-y-1 list-disc list-inside marker:text-primary/40">
        <li>
          soye - <em className="italic">Freaky U</em> 🎶
        </li>
        <li>
          sonakonadore - <em className="italic">OohWeE</em> 🎶
        </li>
      </ul>
    ),
  },
  {
    title: "Fun fact",
    detail: "I sometimes fall asleep listening to horror radio.",
  },
];

function AboutPage() {
  return (
    <div className="space-y-16">
      {/* 1. Header Bio */}
      <section className="flex flex-col md:flex-row gap-8 md:items-center">
        <div className="w-[140px] h-[180px] shrink-0 overflow-hidden bg-primary-container/40">
          <img
            src="/assets/profile.jpg"
            alt="Nami"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 max-w-xl">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal/40">
            Hello, World!
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-medium text-charcoal leading-tight">
            This is Nami.
          </h1>
          <p className="font-sans text-sm md:text-base text-charcoal/60 leading-relaxed">
            This short bio can't hold my whole life story. So I'm putting
            everything I've learned and felt along the way here on this blog
            instead.
          </p>
          <p className="font-sans text-sm md:text-base text-charcoal/60 leading-relaxed">
            It could be an essay, a movie review, or a story about fixing
            problems at work. I'm keeping it open to anything. Nice to meet you!
          </p>
        </div>
      </section>

      {/* 2. Quick Facts */}
      <section className="space-y-5">
        <h2 className="font-headline text-sm uppercase tracking-[0.2em] text-charcoal/40">
          Quick Facts
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 border-t border-charcoal/10 pt-6">
          {facts.map((fact) => (
            <div
              key={fact.title}
              className={fact.title === "Who I am" ? "sm:col-span-2" : ""}
            >
              <dt className="font-headline text-base text-charcoal mb-1">
                {fact.title}
              </dt>
              <dd className="font-sans text-sm text-charcoal/60 leading-relaxed max-w-xl">
                {fact.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 3. Toolbelt */}
      <section className="space-y-5">
        <h2 className="font-headline text-sm uppercase tracking-[0.2em] text-charcoal/40">
          Built with
        </h2>
        <div className="flex flex-wrap gap-2 border-t border-charcoal/10 pt-6">
          {tools.map((tool) => (
            <span
              key={tool.name}
              className="font-mono text-[12px] uppercase tracking-wider px-2 py-1 rounded-sm"
              style={{
                color: tool.color,
                backgroundColor: `color-mix(in srgb, ${tool.color} 12%, transparent)`,
              }}
            >
              {tool.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
