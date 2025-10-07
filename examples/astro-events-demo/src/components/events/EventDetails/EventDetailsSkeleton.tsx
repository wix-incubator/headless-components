import { Skeleton } from '@/components/ui/skeleton';

export function EventDetailsSkeleton() {
  return (
    <div>
      {/* Mobile Image Section */}
      <div className="relative w-full pt-[56.25%] block sm:hidden">
        <Skeleton className="absolute top-0 w-full h-full" />
      </div>

      {/* Header Section */}
      <div className="max-w-5xl mx-auto px-5 py-6 sm:p-16">
        <Skeleton className="h-10 sm:h-16 w-1/2 mb-2" />
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-5 w-32 mb-6" />
        <Skeleton className="h-14 sm:h-12 max-w-2xl mb-8 sm:mb-10" />
        <Skeleton className="h-10 sm:h-12 w-full sm:w-32" />
      </div>

      {/* Desktop Image Section */}
      <div className="relative w-full pt-[56.25%] hidden sm:block">
        <Skeleton className="absolute top-0 w-full h-full" />
      </div>
    </div>
  );
}
