import React, { useState, useEffect } from 'react';
import PlanCard from './PlanCard';
import { useWixClient } from '../hooks/useWixClient';
import type { PlanData } from '../utils/types';

const WelcomeComponent: React.FC = () => {
  const [featuredPlan, setFeaturedPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { fetchPlans, login } = useWixClient();

  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    try {
      await loadFeaturedPlan();
    } catch (error) {
      console.error('Failed to initialize featured plan:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedPlan = async () => {
    try {
      const publicPlans = await fetchPlans();
      setFeaturedPlan(publicPlans[0] ?? null);
    } catch (error) {
      console.error('Error loading featured plan:', error);
      setError(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Loading...</p>
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
              Unable to load featured plan. Please try again later.
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
                  className="text-primary-600 font-semibold no-underline"
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
                  className="text-secondary-800 font-medium hover:text-primary-600 transition-colors duration-200 no-underline"
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
        {/* Hero Section */}
        <section className="text-center py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-700 to-accent-600 bg-clip-text text-transparent leading-tight">
              Master the Art of{' '}
              <span className="relative bg-gradient-to-r from-primary-600 via-secondary-700 to-accent-600 bg-clip-text text-transparent">
                Carpentry
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-accent-500 rounded-full transform scale-105"></div>
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Join our comprehensive carpentry courses taught by master
              craftsmen. From beginner basics to advanced techniques, build your
              skills with hands-on projects and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/courses"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold shadow-large hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline"
              >
                Browse Courses
              </a>
              <a
                href="/pricing"
                className="px-8 py-4 bg-white/90 backdrop-blur-sm text-primary-600 rounded-xl font-semibold shadow-medium hover:shadow-large hover:bg-white transition-all duration-300 border border-primary-200 no-underline"
              >
                View Pricing Plans
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-secondary-800">
              Why Choose MasterCraft Academy?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border border-primary-100">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center mb-6 shadow-medium">
                  <span className="text-white text-2xl">🔨</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-secondary-800">
                  Expert Instructors
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  Learn from master carpenters with decades of experience in
                  both traditional and modern woodworking techniques.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border border-primary-100">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-500 rounded-2xl flex items-center justify-center mb-6 shadow-medium">
                  <span className="text-white text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-secondary-800">
                  Comprehensive Curriculum
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  From basic joinery to advanced furniture making, our
                  structured courses cover everything you need to become a
                  skilled carpenter.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border border-primary-100">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-600 to-accent-500 rounded-2xl flex items-center justify-center mb-6 shadow-medium">
                  <span className="text-white text-2xl">🛠️</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-secondary-800">
                  Hands-on Projects
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  Build real furniture and structures while learning. Take home
                  beautiful pieces you've crafted with your own hands.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Plan Section */}
        {featuredPlan && (
          <section className="py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16 text-secondary-800">
                Featured Course Plan
              </h2>
              <PlanCard
                planData={featuredPlan}
                buttonText="View All Plans"
                onSelectPlan={() => (window.location.href = '/pricing')}
              />
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-secondary-800">
              Ready to Start Your Carpentry Journey?
            </h2>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              Join thousands of students who have already mastered the craft.
              Start building your skills today with our expert-led courses.
            </p>
            <a
              href="/pricing"
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold shadow-large hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline"
            >
              Get Started Now
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WelcomeComponent;
