/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Sticker, Search, Heart, Mail, Share2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmailInput("");
        setShowModal(false);
      }, 2500);
    }
  };

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

            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white font-headline font-bold px-4 py-2 rounded-lg border-2 border-charcoal hard-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(136,77,84,1)] hover:bg-primary/95 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Render Area */}
      <main className="flex-grow max-w-[1100px] w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Dynamic Newsletter Subscription Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-surface-card border-[3px] border-charcoal rounded-xl hard-shadow p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container opacity-25 rounded-bl-full pointer-events-none" />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-charcoal/50 hover:text-charcoal font-bold text-lg cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-6 h-6 text-primary" />
                <h3 className="font-headline text-2xl font-bold">
                  Join the Nami's Log
                </h3>
              </div>
              <p className="font-sans text-sm text-charcoal/70 mb-4">
                Get weekly essays, deep technical deep-dives, and design notes
                directly in your inbox.
              </p>

              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-container border-2 border-primary/50 text-primary p-4 rounded-lg font-headline font-bold flex items-center gap-2"
                >
                  <Heart className="w-5 h-5 animate-pulse" />
                  Subscription successful! Thank you!
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full border-2 border-charcoal rounded-lg px-3 py-2 bg-bg-soft focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans"
                  />
                  <button
                    type="submit"
                    className="w-full bg-secondary text-white font-headline font-bold py-2.5 rounded-lg border-2 border-charcoal hard-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#2d685c] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

          {/* Navigation links & Social tags */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm font-semibold">
            <a
              href="#rss"
              onClick={(e) => e.preventDefault()}
              className="text-charcoal/60 hover:text-primary underline decoration-2 decoration-primary-container underline-offset-4 transition-colors"
            >
              RSS Feed
            </a>
            <a
              href="#code"
              onClick={(e) => e.preventDefault()}
              className="text-charcoal/60 hover:text-secondary underline decoration-2 decoration-secondary-container underline-offset-4 transition-colors"
            >
              Source Code
            </a>
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="text-charcoal/60 hover:text-tertiary underline decoration-2 decoration-tertiary-container underline-offset-4 transition-colors"
            >
              Privacy
            </a>
            <Link
              to="/about"
              className="text-charcoal/60 hover:text-primary underline decoration-2 decoration-primary-container underline-offset-4 transition-colors"
            >
              Contact Nami
            </Link>
          </nav>

          <div className="flex gap-2">
            <button
              onClick={() =>
                alert(
                  "Copied Nami's Log URL to Clipboard! Share it with developers!",
                )
              }
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-charcoal bg-bg-soft hover:bg-secondary-container hover:text-on-secondary-container transition-colors cursor-pointer"
              title="Share blog"
            >
              <Share2 className="w-4 h-4" />
            </button>
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
