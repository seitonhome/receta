import { notFound } from "next/navigation";

/**
 * Catches any unmatched path under a valid locale (e.g. a typo'd URL) so it
 * enters the [locale] layout tree and triggers the localized, branded
 * not-found.tsx instead of falling through to the generic root one.
 */
export default function CatchAll() {
  notFound();
}
