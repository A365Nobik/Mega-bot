const ModelsCardSkeleton = () => {
  return (
    <div className="w-100 h-35 bg-[var(--bg-secondary)] rounded-xl space-y-2 p-4 animate-pulse">
      <div className="w-30 h-8 bg-[var(--bg-primary)] animate-pulse rounded-lg"></div>
      <hr className="text-[var(--text-primary)] animate-pulse" />
      <div className="grid gap-2">
        <div className="w-full h-8 bg-[var(--bg-primary)] animate-pulse rounded-lg"></div>
        <div className="w-full h-8 bg-[var(--bg-primary)] animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
};
export default ModelsCardSkeleton;
