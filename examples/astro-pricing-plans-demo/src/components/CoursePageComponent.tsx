import React, { useEffect, useState } from 'react';
import { useWixClient } from '../hooks/useWixClient';
import { getLevelBadgeClass } from '../utils/course-utils';
import { PlanCardContent } from './PlanCard';
import type { Course } from '../utils/demo-courses';
import {
  PricingPlans,
  type PlanPaywallFallbackData,
} from '@wix/headless-pricing-plans/react';

interface CoursePageComponentProps {
  course: Course;
}

export const CoursePageComponent = (props: CoursePageComponentProps) => {
  if (
    props.course.accessedByPlanIds &&
    props.course.accessedByPlanIds.length > 0
  ) {
    return (
      <PricingPlans.PlanPaywall.Root
        planPaywallServiceConfig={{
          accessPlanIds: props.course.accessedByPlanIds,
        }}
      >
        <PricingPlans.PlanPaywall.Paywall>
          <PricingPlans.PlanPaywall.RestrictedContent>
            <CourseData {...props} />
          </PricingPlans.PlanPaywall.RestrictedContent>
          <PricingPlans.PlanPaywall.Fallback>
            {React.forwardRef<HTMLDivElement, PlanPaywallFallbackData>(
              ({ accessPlanIds, isLoggedIn }, ref) => (
                <RestrictedCourseFallback
                  course={props.course}
                  ref={ref}
                  accessPlanIds={accessPlanIds}
                  isLoggedIn={isLoggedIn}
                />
              ),
            )}
          </PricingPlans.PlanPaywall.Fallback>
        </PricingPlans.PlanPaywall.Paywall>
      </PricingPlans.PlanPaywall.Root>
    );
  }

  return <CourseData {...props} />;
};

const RestrictedCourseFallback = React.forwardRef<
  HTMLDivElement,
  PlanPaywallFallbackData & { course: Course }
>(({ course, isLoggedIn, accessPlanIds }, ref) => {
  const { login, logout } = useWixClient();

  const authLinkText = isLoggedIn ? 'Logout' : 'Login';

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login();
    }
  };

  return (
    <div
      ref={ref}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
    >
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
                  className="text-primary-600 font-semibold no-underline"
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
              <li>
                <button
                  onClick={handleAuthClick}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:shadow-medium transition-all duration-200 font-semibold"
                >
                  {authLinkText}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {/* Course Header */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-large border border-primary-200 relative overflow-hidden">
              {/* Course content with overlay */}
              <div className="relative">
                <div className="flex flex-col lg:flex-row gap-8 opacity-75">
                  {/* Course Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center shadow-medium">
                      <span className="text-white text-4xl">{course.icon}</span>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getLevelBadgeClass(
                          course.level,
                        )}`}
                      >
                        {course.level}
                      </span>
                      <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                        4 hours
                      </span>
                    </div>

                    <h1 className="text-4xl font-bold mb-4 text-secondary-800">
                      Unlock: {course.title}
                    </h1>

                    <p className="text-xl text-secondary-600 mb-6 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-secondary-600 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-primary-600">👨‍🏫</span>
                        <span>
                          <strong>Instructor:</strong> {course.instructor}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-3 text-secondary-800">
                        What you'll learn:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                          Dovetail Joints
                        </span>
                        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                          Mortise & Tenon
                        </span>
                        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                          Hand Tools
                        </span>
                        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                          Wood Selection
                        </span>
                        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                          +1 more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto text-center">
            <PricingPlans.PlanList.Root
              planListServiceConfig={{
                planIds: accessPlanIds,
              }}
            >
              <PricingPlans.PlanList.Plans
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
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
                      No pricing plans available for this course.
                    </p>
                  </div>
                }
              >
                <PricingPlans.PlanList.PlanRepeater>
                  <PlanCardContent buttonText="Get Started" showButton />
                </PricingPlans.PlanList.PlanRepeater>
              </PricingPlans.PlanList.Plans>
            </PricingPlans.PlanList.Root>
          </div>
        </section>
      </main>
    </div>
  );
});

const CourseData: React.FC<CoursePageComponentProps> = ({ course }) => {
  const { getIsLoggedIn, login, logout } = useWixClient();
  const [isLoggedIn] = useState<boolean>(getIsLoggedIn());

  const handleStartCourse = () => {
    if (
      course.isFree ||
      !course.accessedByPlanIds ||
      course.accessedByPlanIds.length === 0
    ) {
      // Course is free, can start directly
      alert(`Starting "${course.title}" course...

This would navigate to the course content in a real implementation.`);
    } else {
      // Course requires subscription
    }
  };

  const authLinkText = isLoggedIn ? 'Logout' : 'Login';

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login();
    }
  };

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
                  className="text-primary-600 font-semibold no-underline"
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
              <li>
                <button
                  onClick={handleAuthClick}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:shadow-medium transition-all duration-200 font-semibold"
                >
                  {authLinkText}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {/* Course Header */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-large border border-primary-200">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Course Icon */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center shadow-medium">
                    <span className="text-white text-4xl">{course.icon}</span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getLevelBadgeClass(
                        course.level,
                      )}`}
                    >
                      {course.level}
                    </span>
                    {course.isFree && (
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Free
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl font-bold mb-4 text-secondary-800">
                    {course.title}
                  </h1>

                  <p className="text-xl text-secondary-600 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-secondary-600 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-primary-600">📅</span>
                      <span>
                        <strong>Duration:</strong> {course.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary-600">👨‍🏫</span>
                      <span>
                        <strong>Instructor:</strong> {course.instructor}
                      </span>
                    </div>
                  </div>

                  {/* Start Course Button */}
                  <div className="flex gap-4">
                    <button
                      className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold shadow-large hover:shadow-xl hover:scale-105 transition-all duration-300"
                      onClick={handleStartCourse}
                    >
                      Start Course
                    </button>
                    <a
                      href="/courses"
                      className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-200 rounded-xl font-semibold shadow-medium hover:shadow-large hover:border-primary-300 transition-all duration-300 no-underline"
                    >
                      Back to Courses
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content Preview */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-large border border-primary-200">
              <h2 className="text-2xl font-bold mb-6 text-secondary-800">
                What You'll Learn
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-secondary-600">
                      Master fundamental techniques and safety practices
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-secondary-600">
                      Learn proper tool usage and maintenance
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-secondary-600">
                      Complete hands-on projects
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-secondary-600">
                      Get personalized feedback from instructors
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-secondary-600">
                      Access to community forums
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-secondary-600">
                      Downloadable resources and templates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
