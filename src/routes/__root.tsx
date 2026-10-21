/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createRootRoute,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { Search, Share2, Check, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { database } from "../firebase";
import { ref, runTransaction } from "firebase/database";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const countedDate = useRef<string | null>(null);
  const [isDark, setIsDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const dailyStorageKey = "nami-daily-visitor-counted";
    const totalStorageKey = "nami-total-visitor-counted";
    const recordVisitors = () => {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const shouldCountDaily =
        countedDate.current !== today &&
        window.localStorage.getItem(dailyStorageKey) !== today;
      const shouldCountTotal = !window.localStorage.getItem(totalStorageKey);

      if (shouldCountDaily) {
        countedDate.current = today;
        window.localStorage.setItem(dailyStorageKey, today);
        void incrementVisitorCounter(
          `dailyUniqueVisitors/${today}`,
          dailyStorageKey,
          today,
        );
      }

      if (shouldCountTotal) {
        window.localStorage.setItem(totalStorageKey, "true");
        void incrementVisitorCounter(
          "totalUniqueVisitors",
          totalStorageKey,
          "true",
        );
      }
    };

    recordVisitors();
    const intervalId = window.setInterval(recordVisitors, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      id="site-root"
      className={`${isDark ? "dark" : ""} min-h-screen flex flex-col bg-bg-soft text-charcoal font-sans selection:bg-primary-container selection:text-primary transition-colors duration-200`}
    >
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-surface-card border-b border-charcoal/10">
        <div className="max-w-[1100px] mx-auto px-6 py-5 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group">
            <span className="font-headline text-xl font-normal tracking-tight text-charcoal">
              Nami's Log
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex gap-10 items-center">
            <Link
              to="/"
              activeProps={{
                className: "text-primary border-b border-primary",
              }}
              inactiveProps={{
                className: "text-charcoal/50 hover:text-primary",
              }}
              className="font-headline text-md tracking-wide pb-1 transition-colors"
              activeOptions={{ exact: true }}
            >
              Articles
            </Link>
            <Link
              to="/explore"
              activeProps={{
                className: "text-primary border-b border-primary",
              }}
              inactiveProps={{
                className: "text-charcoal/50 hover:text-primary",
              }}
              className="font-headline text-md tracking-wide pb-1 transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/about"
              activeProps={{
                className: "text-primary border-b border-primary",
              }}
              inactiveProps={{
                className: "text-charcoal/50 hover:text-primary",
              }}
              className="font-headline text-md tracking-wide pb-1 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-2">
            <Link
              to="/explore"
              className="p-2 text-charcoal/60 hover:text-primary transition-colors"
              title="Search articles"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </Link>
            <button
              type="button"
              onClick={() => setIsDark((current) => !current)}
              className="p-2 text-charcoal/60 hover:text-primary transition-colors cursor-pointer"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="w-[18px] h-[18px]" strokeWidth={1.5} />
              ) : (
                <Moon className="w-[18px] h-[18px]" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Render Area */}
      <main className="flex-grow max-w-[1100px] w-full mx-auto px-6 py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal/10 mt-12">
        <div className="max-w-[1100px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <span className="font-headline text-sm tracking-wide text-charcoal">
              Nami's Log
            </span>
            <p className="font-sans text-xs text-charcoal/40">© 2026 Nami</p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2 justify-center text-sm">
            <Link
              to="/about"
              className="text-charcoal/50 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          <ShareButton />
        </div>
      </footer>
    </div>
  );
}

function incrementVisitorCounter(path: string, storageKey: string, marker: string) {
  void runTransaction(ref(database, path), (count) => {
    if (count !== null && typeof count !== "number") return;
    return (count ?? 0) + 1;
  })
    .then((result) => {
      if (!result.committed) {
        throw new Error(`Realtime Database rejected counter update: ${path}`);
      }
    })
    .catch((error: unknown) => {
      if (window.localStorage.getItem(storageKey) === marker) {
        window.localStorage.removeItem(storageKey);
      }
      console.error("Failed to record visitor:", error);
    });
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
      className="flex items-center gap-1.5 text-xs text-charcoal/50 hover:text-primary transition-colors cursor-pointer"
      title={copied ? "Link copied!" : "Copy link to this page"}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
          Copied
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          Share
        </>
      )}
    </button>
  );
}
