/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Award, Sparkles, Code, CheckCircle, Terminal } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

interface Tool {
  name: string;
  category: "core" | "framework" | "tooling";
  level: string;
  description: string;
  iconColor: string;
  bgColor: string;
}

const activeTools: Tool[] = [
  {
    name: "TypeScript 5.8",
    category: "core",
    level: "100% Typed",
    description:
      "Strict typing guidelines and custom system abstractions. Keeps errors in check before compiling.",
    iconColor: "text-[#3178c6]",
    bgColor: "bg-[#3178c6]/10",
  },
  {
    name: "React 19",
    category: "framework",
    level: "Frictionless",
    description:
      "Leveraging modern functional hooks, Concurrent features, and Server-side layouts seamlessly.",
    iconColor: "text-[#61dafb]",
    bgColor: "bg-[#61dafb]/10",
  },
  {
    name: "Tailwind CSS v4",
    category: "core",
    level: "Pixel Perfect",
    description:
      "A utility-first engine utilized for beautiful soft neo-brutalist bento designs and eye-safe themes.",
    iconColor: "text-[#38bdf8]",
    bgColor: "bg-[#38bdf8]/10",
  },
  {
    name: "TanStack Router",
    category: "framework",
    level: "Ultra Safe",
    description:
      "Vite file-based routing scheme that provides type safety on paths, loaders, and routing parameters.",
    iconColor: "text-[#ff4154]",
    bgColor: "bg-[#ff4154]/10",
  },
  {
    name: "Motion",
    category: "framework",
    level: "Springy",
    description:
      "Orchestrating micro-interactions, layout transitions, and scroll triggers for delightful UX.",
    iconColor: "text-[#ff0055]",
    bgColor: "bg-[#ff0055]/10",
  },
  {
    name: "Vite 6",
    category: "tooling",
    level: "Blazing Fast",
    description:
      "The rapid building server backing Nami's Log, turning seeds into robust application layouts in milliseconds.",
    iconColor: "text-[#646cff]",
    bgColor: "bg-[#646cff]/10",
  },
];

function AboutPage() {
  const [activeFact, setActiveFact] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const facts = [
    {
      title: "Who I am",
      detail:
        "Front-end Engineer & Writer (not professional just my hobby) Actively writing essays, tutorials, and code snippets about React, TypeScript, and web development.",
      color: "bg-secondary-container",
    },
    {
      title: "Currently",
      detail: "TODO: 지금 배우고 있거나 몰두하고 있는 것을 적어주세요.",
      color: "bg-primary-container",
    },
    {
      title: "Favorite stack",
      detail: "TODO: 즐겨 쓰는 도구/라이브러리와 그 이유를 적어주세요.",
      color: "bg-tertiary-container",
    },
    {
      title: "Fun fact",
      detail: "TODO: 가벼운 개인적인 이야기를 하나 적어주세요.",
      color: "bg-emerald-100",
    },
  ];

  return (
    <div className="space-y-12">
      {/* 1. Header Bio Hero Section */}
      <section className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Avatar Area inside a Neo-Brutalist Frame */}
        <motion.div
          initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
          animate={{ rotate: 1, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative shrink-0"
        >
          <div className="w-[200px] h-[200px] md:w-[260px] md:h-[260px] rounded-2xl border-[3px] border-charcoal bg-white overflow-hidden hard-shadow-secondary rotate-3">
            <img
              src="/assets/coromon.png"
              alt="Nami"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
          {/* Top badge on avatar */}
          <div
            className="absolute -top-3 -right-3 bg-primary-container text-primary border-2 border-charcoal p-2 rounded-xl hard-shadow-sm rotate-12 cursor-pointer"
            title="Cozy level: 1000%"
          >
            <Sparkles className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Introduction Bio Text */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1 text-sm font-mono font-bold text-secondary bg-secondary-container px-3 py-1 rounded-full border-2 border-charcoal">
            💻 개발자
          </div>
          <h1 className="font-headline text-3xl md:text-5xl font-black text-charcoal leading-tight">
            Meet Nami, <span className="italic text-primary">개발자</span> &
            <span className="italic text-secondary">글쓰기 인간</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-charcoal/80 leading-relaxed">
            TODO: 자기소개를 작성하세요 — 어떤 일을 하는지, 왜 이 블로그를 쓰는지.
          </p>
          <p className="font-sans text-sm md:text-base text-charcoal/80 leading-relaxed">
            TODO: 관심 분야나 최근 몰두하고 있는 주제를 덧붙여보세요.
          </p>
        </div>
      </section>

      {/* 2. Quick Facts Bento Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-headline font-bold text-2xl text-charcoal">
          <Award className="w-6 h-6 text-secondary fill-secondary-container" />
          <h2>Cozy Quick Facts</h2>
          <div className="h-[2px] bg-charcoal/10 flex-grow" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {facts.map((fact, index) => {
            const isSelected = activeFact === index;
            return (
              <motion.div
                key={fact.title}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveFact(isSelected ? null : index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveFact(isSelected ? null : index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={isSelected}
                className={`p-5 rounded-xl border-[3.5px] border-charcoal hard-shadow-sm cursor-pointer transition-all ${fact.color} ${
                  isSelected
                    ? "scale-105 shadow-[4px_4px_0px_0px_rgba(45,104,92,1)]"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-headline font-bold text-lg text-charcoal">
                    {fact.title}
                  </h3>
                  <div className="w-5 h-5 rounded-full bg-white border border-charcoal flex items-center justify-center font-bold text-xs select-none">
                    {isSelected ? "✓" : "?"}
                  </div>
                </div>
                <p className="font-sans text-sm text-charcoal/85 leading-snug">
                  {isSelected
                    ? fact.detail
                    : fact.detail.length > 120
                      ? fact.detail.slice(0, 120) + "…"
                      : fact.detail}
                </p>
                <span className="block text-[10px] font-mono text-charcoal/50 mt-3 uppercase tracking-wider">
                  {isSelected ? "Hide details" : "Show details"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Toolbelt Stack Icons with interactive panels */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-headline font-bold text-2xl text-charcoal">
          <Terminal className="w-6 h-6 text-tertiary" />
          <h2>Toolbelt Stack</h2>
          <div className="h-[2px] bg-charcoal/10 flex-grow" />
        </div>

        <div className="bg-surface-card border-[3px] border-charcoal rounded-2xl p-6 md:p-8 hard-shadow-tertiary">
          <p className="font-sans text-sm md:text-base text-charcoal/70 mb-6">
            These are the core instruments, architectural schemas, and libraries
            that I leverage everyday to nurture frontend plants and deliver
            beautiful responsive systems.{" "}
            <strong className="text-primary">
              Click on any module badge to view spec details:
            </strong>
          </p>

          {/* Interactive Stack list badges */}
          <div className="flex flex-wrap gap-4">
            {activeTools.map((tool) => (
              <button
                key={tool.name}
                onClick={() =>
                  setSelectedTool(
                    selectedTool?.name === tool.name ? null : tool,
                  )
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[3.5px] border-charcoal font-headline font-bold text-base md:text-lg transition-all bouncy-hover cursor-pointer ${
                  selectedTool?.name === tool.name
                    ? "bg-tertiary-container text-tertiary hard-shadow-tertiary translate-y-[-2px]"
                    : "bg-bg-soft text-charcoal"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg border-2 border-charcoal ${tool.bgColor} ${tool.iconColor}`}
                >
                  <Code className="w-4 h-4" />
                </div>
                <span>{tool.name}</span>
                <span className="font-mono text-[10px] uppercase font-bold text-charcoal/50 px-1.5 py-0.5 bg-white border border-charcoal/30 rounded">
                  {tool.level}
                </span>
              </button>
            ))}
          </div>

          {/* Interactive specification panel details */}
          <AnimatePresence mode="wait">
            {selectedTool ? (
              <motion.div
                key={selectedTool.name}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-8 p-5 bg-tertiary-container/30 border-2 border-charcoal rounded-xl overflow-hidden space-y-2 relative"
              >
                <div className="absolute top-3 right-3 text-xs font-mono font-black text-charcoal/40 uppercase">
                  TOOL SPECS
                </div>
                <h3 className="font-headline font-black text-lg text-charcoal flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-tertiary" />
                  {selectedTool.name} — Detailed Capabilities
                </h3>
                <p className="font-sans text-sm md:text-base text-charcoal/80 leading-relaxed">
                  {selectedTool.description}
                </p>
                <div className="flex items-center gap-2 pt-2 text-xs font-mono font-bold text-charcoal/60">
                  <span>Class: {selectedTool.category.toUpperCase()}</span>
                  <span>•</span>
                  <span>Affiliation: {selectedTool.level}</span>
                </div>
              </motion.div>
            ) : (
              <div className="mt-8 p-6 text-center border-2 border-dashed border-charcoal/20 rounded-xl text-xs font-mono uppercase tracking-wider text-charcoal/50">
                Click any stack tool to launch digital instrumentation panels.
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
