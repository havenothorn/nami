/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface NotFoundProps {
  title?: string;
  message?: string;
}

export function NotFound({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
}: NotFoundProps) {
  return (
    <div className="text-center py-24 space-y-5 max-w-md mx-auto">
      <h1 className="font-headline text-2xl font-medium text-charcoal">
        {title}
      </h1>
      <p className="font-sans text-sm text-charcoal/60">{message}</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-charcoal border-b border-charcoal pb-0.5 hover:text-primary hover:border-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
        Back to Home
      </Link>
    </div>
  );
}
