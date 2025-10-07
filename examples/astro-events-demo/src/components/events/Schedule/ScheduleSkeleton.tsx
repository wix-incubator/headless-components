import { Skeleton } from '@/components/ui/skeleton';

export function ScheduleSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-6 sm:p-16">
      {/* Header section */}
      <div className="flex justify-between">
        <div className="flex flex-col mb-10">
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-5 w-56" />
        </div>
        <Skeleton className="h-10 w-32 hidden sm:block" />
      </div>

      {/* Filter section */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Schedule groups */}
      <div>
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="border border-foreground/10 p-5 sm:py-8 sm:px-6"
            >
              <div className="flex gap-2 sm:gap-6 flex-col sm:flex-row">
                <div className="min-w-[150px]">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <div className="flex gap-1 items-center mb-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                  <div className="mt-3">
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
