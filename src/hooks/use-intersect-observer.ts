import { useRef, useCallback } from "react";

export function useIntersectionObserver(onIntersect: () => void) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const setObserver = useCallback(
    (node:HTMLDivElement | null) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onIntersect();
          }
        },
        { threshold: 1.0 }
      );
      observer.observe(node);
    },
    [onIntersect]
  );

  return { sentinelRef, setObserver };
}
