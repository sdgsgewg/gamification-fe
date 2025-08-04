import type { Metadata } from "next";

export function withMetadata(
  title: string,
  description = "Website berbasis Next.js"
): Metadata {
  return {
    title: `${title} - Gamification Next.js Starter`,
    description,
  };
}
