import { Skeleton } from '@/components/ui/skeleton';

export function EventListSkeleton() {
  return (
    <div className="grid justify-center grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="flex flex-col bg-background border border-foreground/10"
        >
          {/* Image skeleton */}
          <div className="relative w-full pt-[100%] bg-primary/80">
            <Skeleton className="absolute top-0 w-full h-full" />
          </div>

          {/* Content skeleton */}
          <div className="p-5 sm:p-8 flex flex-col sm:items-center">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-3" />

            {/* Date and location skeleton */}
            <div className="mb-8 flex gap-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20 hidden sm:block" />
            </div>

            {/* RSVP button skeleton */}
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
