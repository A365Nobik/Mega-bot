"use client";
import { memo } from "react";

const LoadingDots = memo(() => {
  return (
    <div className="flex items-center gap-1 h-6">
      {Array(3)
        .fill(0)
        .map((_, idx) => (
          <span
            key={idx}
            className="w-2 h-2 bg-(--bg-primary) rounded-full animate-bounce duration-75"
            style={{ animationDelay: `${(idx + 1) * 100}ms` }}
          />
        ))}
    </div>
  );
});

LoadingDots.displayName = "LoadingDots";
export default LoadingDots;
