import { useEffect, useState } from 'react';
import { useWixClient } from '../hooks/useWixClient';

interface RestrictedContentComponentProps {
  planIds: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RestrictedContentComponent: React.FC<
  RestrictedContentComponentProps
> = ({ planIds, children, fallback }) => {
  const { getMemberHasPlansAccess } = useWixClient();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const access = await getMemberHasPlansAccess(planIds);
        setHasAccess(access);
      } catch (error) {
        console.error('Error checking access:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAccess();
  }, [planIds, getMemberHasPlansAccess]);

  if (isLoading) {
    return null;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
