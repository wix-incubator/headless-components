import React from 'react';
import { PlanCardContent } from './PlanCard';
import { useWixClient } from '../hooks/useWixClient';
import { PricingPlans } from '@wix/headless-pricing-plans/react';

const PricingPageComponent: React.FC = () => {
  const { login } = useWixClient();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-primary-100 sticky top-0 z-50 shadow-subtle">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center shadow-medium">
                <span className="text-white font-bold text-lg">MC</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-700 bg-clip-text text-transparent">
                MasterCraft Carpentry Academy
              </span>
            </div>
            <ul className="flex items-center space-x-8">
              <li>
                <a
                  href="/"
                  className="text-secondary-800 font-medium hover:text-primary-600 transition-colors duration-200 no-underline"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/courses"
                  className="text-secondary-800 font-medium hover:text-primary-600 transition-colors duration-200 no-underline"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-primary-600 font-semibold no-underline"
                >
                  Pricing Plans
                </a>
              </li>
              <li id="auth-link">
                <button
                  onClick={login}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:shadow-medium transition-all duration-200 font-semibold"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <section className="text-center py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-700 to-accent-600 bg-clip-text text-transparent">
              Choose Your Learning Path
            </h1>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              Select the perfect plan to match your carpentry goals. All plans
              include lifetime access to course materials and our supportive
              community.
            </p>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="py-12">
          <PricingPlans.PlanList.Root planListServiceConfig={{}}>
            <PricingPlans.PlanList.Plans
              loadingState={
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-secondary-600">
                    Loading pricing plans...
                  </p>
                </div>
              }
              emptyState={
                <div className="text-center py-20">
                  <p className="text-secondary-600">
                    No pricing plans available at the moment.
                  </p>
                </div>
              }
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              <PricingPlans.PlanList.PlanRepeater>
                <PlanCardContent buttonText="Select Plan" showButton />
              </PricingPlans.PlanList.PlanRepeater>
            </PricingPlans.PlanList.Plans>
          </PricingPlans.PlanList.Root>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-secondary-800">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-medium">
                <h3 className="text-xl font-bold mb-4 text-secondary-800">
                  Can I change my plan later?
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  Yes! You can upgrade or downgrade your plan at any time from
                  your member dashboard. Changes take effect immediately.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-medium">
                <h3 className="text-xl font-bold mb-4 text-secondary-800">
                  Do I get lifetime access to courses?
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  All our plans include lifetime access to purchased courses.
                  Once you enroll, you can access the materials anytime,
                  forever.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-medium">
                <h3 className="text-xl font-bold mb-4 text-secondary-800">
                  Is there a money-back guarantee?
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  We offer a 30-day money-back guarantee on all plans. If you're
                  not satisfied, contact us for a full refund.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PricingPageComponent;
