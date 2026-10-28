import type { FC } from "react";

export const RouteLoader: FC = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default RouteLoader;
