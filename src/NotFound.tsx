/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface NotFoundProps {
  title?: string;
  message?: string;
}

export function NotFound({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
}: NotFoundProps) {
  return (
    <div className="text-center py-16 space-y-6 max-w-md mx-auto">
      <div className="inline-flex p-4 bg-secondary-container text-secondary rounded-full border-2 border-charcoal">
        <AlertTriangle className="w-10 h-10 animate-bounce" />
      </div>
      <h1 className="font-headline text-3xl font-black text-charcoal">
        {title}
      </h1>
      <p className="font-sans text-sm text-charcoal/70">{message}</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white border-2 border-charcoal rounded-lg font-headline font-bold hover:bg-primary/95 transition-all outline-none"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
