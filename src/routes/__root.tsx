/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Sticker, Search, Heart, Share2, Check } from "lucide-react";
import { useState } from "react";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-soft text-charcoal font-sans selection:bg-primary-container selection:text-primary">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-surface-card border-b-2 border-charcoal hard-shadow-sm">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="p-1 bg-primary-container border-2 border-charcoal rounded-lg group-hover:rotate-12 transition-transform">
              <Sticker className="w-6 h-6 text-primary" />
            </div>
            <span className="font-headline text-2xl font-bold tracking-tight text-primary italic">
              Nami's Log
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link
              to="/"
              activeProps={{
                className: "text-primary font-bold border-b-2 border-primary",
              }}
              inactiveProps={{
                className: "text-charcoal/70 hover:text-primary",
              }}
              className="font-headline font-semibold text-base transition-colors"
              activeOptions={{ exact: true }}
            >
              Essays & Tutorials
            </Link>
            <Link
              to="/explore"
              activeProps={{
                className: "text-primary font-bold border-b-2 border-primary",
              }}
              inactiveProps={{
                className: "text-charcoal/70 hover:text-primary",
              }}
              className="font-headline font-semibold text-base transition-colors"
            >
              Explore Topics
            </Link>
            <Link
              to="/about"
              activeProps={{
                className: "text-primary font-bold border-b-2 border-primary",
              }}
              inactiveProps={{
                className: "text-charcoal/70 hover:text-primary",
              }}
              className="font-headline font-semibold text-base transition-colors"
            >
              About Nami
            </Link>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="p-2 border-2 border-charcoal bg-surface-card rounded-lg hover:bg-primary-container/20 transition-all active:translate-x-[1px] active:translate-y-[1px]"
              title="Search articles"
            >
              <Search className="w-5 h-5 text-charcoal" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Render Area */}
      <main className="flex-grow max-w-[1100px] w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Cozy Decorative Footer */}
      <footer className="bg-surface-card border-t-2 border-dashed border-charcoal mt-12">
        <div className="max-w-[1100px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-1">
              <Sticker className="w-5 h-5 text-secondary" />
              <span className="font-headline font-semibold text-lg text-secondary italic">
                Nami's Log
              </span>
            </div>
            <p className="font-sans text-xs text-charcoal/60">© 2026 Nami</p>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm font-semibold">
            <Link
              to="/explore"
              className="text-charcoal/60 hover:text-primary underline decoration-2 decoration-primary-container underline-offset-4 transition-colors"
            >
              Explore Topics
            </Link>
            <Link
              to="/about"
              className="text-charcoal/60 hover:text-primary underline decoration-2 decoration-primary-container underline-offset-4 transition-colors"
            >
              Contact Nami
            </Link>
          </nav>

          <div className="flex gap-2">
            <ShareButton />
            <div
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-charcoal bg-bg-soft select-none"
              title="Made with heart"
            >
              <Heart className="w-4 h-4 text-secondary fill-secondary-container" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-charcoal bg-bg-soft hover:bg-secondary-container hover:text-on-secondary-container transition-colors cursor-pointer"
      title={copied ? "Link copied!" : "Copy link to this page"}
    >
      {copied ? (
        <Check className="w-4 h-4 text-primary" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
    </button>
  );
}
