import React, { useState, useEffect } from 'react';
import PlanCard from './PlanCard';
import { useWixClient } from '../hooks/useWixClient';
import type { PlanData } from '../utils/types';

const PricingPageComponent: React.FC = () => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { fetchPlans, goToPlanCheckout, login } = useWixClient();

  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    try {
      await loadPlans();
    } catch (error) {
      console.error('Failed to initialize pricing page:', error);
      setError(true);
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const publicPlans = await fetchPlans();
      setPlans(publicPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    const button = document.getElementById(`plan-button-${planId}`);
    if (button) {
      button.innerHTML = `
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          <span>Loading...</span>
        </div>
      `;
    }

    try {
      await goToPlanCheckout(planId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');

      if (button) {
        button.innerHTML = 'Select Plan';
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Loading pricing plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center py-20">
            <p className="text-red-600">
              Unable to load pricing plans. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          {plans.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-secondary-600">
                No pricing plans available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  planData={plan}
                  isPopular={index === 1}
                  onSelectPlan={handleSelectPlan}
                  buttonText="Select Plan"
                />
              ))}
            </div>
          )}
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
