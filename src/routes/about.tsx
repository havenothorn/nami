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
  level: string;
  description: string;
}

const tools: Tool[] = [
  {
    name: "TypeScript 5.8",
    level: "Strict",
    description:
      "Strict typing guidelines and custom system abstractions. Keeps errors in check before compiling.",
  },
  {
    name: "React 19",
    level: "Hooks",
    description:
      "Modern functional hooks and concurrent features throughout the app.",
  },
  {
    name: "Tailwind CSS v4",
    level: "Utility-first",
    description:
      "CSS-first configuration for a small, consistent design system.",
  },
  {
    name: "TanStack Router",
    level: "Type-safe",
    description:
      "File-based routing with type safety on paths, loaders, and params.",
  },
  {
    name: "Motion",
    level: "Subtle",
    description: "Light entrance transitions, used sparingly.",
  },
  {
    name: "Vite 6",
    level: "Fast",
    description: "The build tool and dev server behind Nami's Log.",
  },
];

const facts: { title: string; detail: ReactNode }[] = [
  {
    title: "Who I am",
    detail: (
      <div className="space-y-3 max-w-xl">
        <p className="text-charcoal underline">
          Front-end Engineer & Writer{" "}
          <em className="italic text-charcoal/60">
            (not professional, just my hobby)
          </em>
        </p>
        <p>
          Beyond building screens, I love exploring the diverse layers of the
          world.
        </p>
        <div className="space-y-1">
          <p>
            <span className="font-mono text-[12px] uppercase tracking-wider text-primary mr-2">
              Input
            </span>
            Eclectic movies, reading & transcribing, and solo cultural
            wanderings
          </p>
          <p>
            <span className="font-mono text-[12px] uppercase tracking-wider text-primary mr-2">
              Output
            </span>
            Conversations with loved ones, walking up Namsan, and practicing
            yoga
          </p>
        </div>
        <p>
          I write and create based on the inspirations gathered from my daily
          life.
        </p>
      </div>
    ),
  },
  {
    title: "Currently",
    detail: "TODO: 지금 배우고 있거나 몰두하고 있는 것을 적어주세요.",
  },
  {
    title: "Favorite stack",
    detail: "TODO: 즐겨 쓰는 도구/라이브러리와 그 이유를 적어주세요.",
  },
  {
    title: "Fun fact",
    detail: "TODO: 가벼운 개인적인 이야기를 하나 적어주세요.",
  },
];

function AboutPage() {
  return (
    <div className="space-y-16">
      {/* 1. Header Bio */}
      <section className="flex flex-col md:flex-row gap-8 md:items-center">
        <div className="w-[140px] h-[180px] shrink-0 overflow-hidden bg-primary-container/40">
          <img
            src="/assets/profile.png"
            alt="Nami"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal/40">
            About
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-medium text-charcoal leading-tight">
            Meet Nami — 개발자 & 글쓰기 인간
          </h1>
          <p className="font-sans text-sm md:text-base text-charcoal/60 leading-relaxed">
            TODO: 자기소개를 작성하세요 — 어떤 일을 하는지, 왜 이 블로그를
            쓰는지.
          </p>
          <p className="font-sans text-sm md:text-base text-charcoal/60 leading-relaxed">
            TODO: 관심 분야나 최근 몰두하고 있는 주제를 덧붙여보세요.
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
              <dd className="font-sans text-sm text-charcoal/60 leading-relaxed">
                {fact.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 3. Toolbelt */}
      <section className="space-y-5">
        <h2 className="font-headline text-sm uppercase tracking-[0.2em] text-charcoal/40">
          Toolbelt
        </h2>
        <div className="border-t border-charcoal/10">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4 border-b border-charcoal/10"
            >
              <div className="sm:w-48 shrink-0 flex items-baseline gap-2">
                <span className="font-headline text-base text-charcoal">
                  {tool.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal/40">
                  {tool.level}
                </span>
              </div>
              <p className="font-sans text-sm text-charcoal/60">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
