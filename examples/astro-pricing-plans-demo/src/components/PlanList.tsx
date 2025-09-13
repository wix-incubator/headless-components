import { useEffect, useState } from 'react';
import { useWixClient } from '../hooks/useWixClient';
import type { PlanData } from '../utils/types';

type PlanListProps = {
  children: (props: {
    plans: PlanData[];
    isLoading: boolean;
  }) => React.ReactNode;
} & (
  | {
      plans: PlanData[];
    }
  | { planIds: string[] }
);

export const PlanList = (props: PlanListProps) => {
  const { fetchPlans } = useWixClient();
  const propsHasPlans = 'plans' in props;
  const [plans, setPlans] = useState<PlanData[] | null>(
    propsHasPlans ? props.plans : []
  );

  useEffect(() => {
    if (!propsHasPlans) {
      loadPlans(props.planIds);
    }
  }, []);

  function loadPlans(planIds: string[]) {
    fetchPlans(planIds).then(setPlans);
  }

  if (!plans?.length) {
    return null;
  }

  return <>{props.children({ plans, isLoading: !plans })}</>;
};
