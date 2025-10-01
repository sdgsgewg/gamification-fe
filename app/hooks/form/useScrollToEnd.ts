"use client";

import { useEffect, RefObject } from "react";

export function useScrollToEnd<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  deps: readonly unknown[] = [] 
) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [ref, ...deps]);
}
