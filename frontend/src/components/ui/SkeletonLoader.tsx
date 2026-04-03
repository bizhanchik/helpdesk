interface SkeletonProps {
  /** Number of skeleton rows to render */
  rows?: number;
}

/** Animated skeleton placeholder for loading states */
const SkeletonLoader = ({ rows = 4 }: SkeletonProps) => {
  return (
    <div className="space-y-3" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-border p-5 animate-pulse"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-slate-200 rounded-full" />
              <div className="h-5 w-14 bg-slate-100 rounded-full" />
            </div>
          </div>
          <div className="mt-3 h-3 bg-slate-100 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
