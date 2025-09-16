import React, { useState, useEffect } from 'react';
import { getLevelBadgeClass } from '../utils/course-utils';
import { useWixClient } from '../hooks/useWixClient';
import { getAllCourses, type Course } from '../utils/demo-courses';
import {
  PricingPlans,
  type PlanRecurrenceData,
} from '@wix/headless-pricing-plans/react';

// Separate component for locked course card to properly manage state
const LockedCourseCard: React.FC<{
  course: Course;
  planIds: string[];
}> = ({ course, planIds }) => {
  const [showPlans, setShowPlans] = React.useState(false);

  const handleCourseClick = () => {
    setShowPlans(true);
  };

  return (
    <>
      <div
        key={course.id}
        className="relative bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-large border border-primary-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
        onClick={handleCourseClick}
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center mb-4 shadow-medium">
            <span className="text-white text-2xl">{course.icon}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-secondary-800">
            {course.title}
          </h3>
          <p className="text-secondary-600 mb-4 leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelBadgeClass(
                course.level,
              )}`}
            >
              {course.level}
            </span>
            <span className="text-sm text-secondary-500">
              {course.duration}
            </span>
          </div>
          <div className="text-sm text-secondary-600">
            <strong>Instructor:</strong> {course.instructor}
          </div>
        </div>

        <div className="mt-6">
          <button
            className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-medium hover:shadow-large"
            onClick={(e) => {
              e.stopPropagation();
              handleCourseClick();
            }}
          >
            Start Course
          </button>
        </div>
      </div>

      <PricingPlans.PlanList.Root planListServiceConfig={{ planIds }}>
        <PricingPlans.PlanList.Plans asChild>
          {({ plans, isLoading, error }, ref) =>
            !isLoading &&
            !error &&
            showPlans && (
              <div
                ref={ref as React.RefObject<HTMLDivElement>}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowPlans(false)}
              >
                <div
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-large text-center max-w-sm mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">🔒</span>
                  </div>
                  <h4 className="font-bold text-secondary-800 mb-2">
                    Premium Course
                  </h4>

                  {plans.length === 1 ? (
                    <PricingPlans.Plan.Root
                      planServiceConfig={{ plan: plans[0] }}
                    >
                      <p className="text-sm text-secondary-600 mb-4">
                        Unlock this course with a subscription
                      </p>
                      <PricingPlans.Plan.Action.BuyNow
                        className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-medium text-sm hover:shadow-medium transition-all duration-200"
                        label={`Get "${plans[0].name}" plan`}
                      />
                    </PricingPlans.Plan.Root>
                  ) : (
                    <>
                      <p className="text-sm text-secondary-600 mb-4">
                        Choose a plan to unlock this course:
                      </p>
                      <div className="space-y-2">
                        <PricingPlans.PlanList.PlanRepeater>
                          <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <PricingPlans.Plan.Name className="font-medium text-sm text-gray-900" />
                              <PricingPlans.Plan.Price className="text-sm font-semibold text-gray-900" />
                              <PricingPlans.Plan.Recurrence>
                                {React.forwardRef<
                                  HTMLSpanElement,
                                  PlanRecurrenceData
                                >(({ recurrence }, ref) => {
                                  if (!recurrence) return null;

                                  return (
                                    <span
                                      ref={ref}
                                      className="text-xs text-gray-500 ml-1"
                                    >
                                      /{recurrence.period.toLowerCase()}
                                    </span>
                                  );
                                })}
                              </PricingPlans.Plan.Recurrence>
                            </div>
                            <PricingPlans.Plan.Action.BuyNow
                              className="w-full px-3 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-md font-medium text-xs hover:shadow-md transition-all duration-200"
                              label="Get plan now"
                            />
                          </div>
                        </PricingPlans.PlanList.PlanRepeater>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          }
        </PricingPlans.PlanList.Plans>
      </PricingPlans.PlanList.Root>
    </>
  );
};

const CoursesPageComponent: React.FC = () => {
  const { getIsLoggedIn, login, logout } = useWixClient();
  const [isLoggedIn] = useState(getIsLoggedIn());

  const courses = getAllCourses();

  const handleCourseClick = (course: Course) => {
    // Navigate to individual course page
    window.location.href = `/courses/${course.id}`;
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
        {/* Header */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-700 to-accent-600 bg-clip-text text-transparent">
              Carpentry Courses
            </h1>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              Master the art of woodworking with our comprehensive course
              library. From beginner basics to advanced techniques, we have
              something for every skill level.
            </p>

            {!isLoggedIn && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-medium mb-8 inline-block">
                <p className="text-blue-700">
                  <button
                    onClick={login}
                    className="text-primary-600 hover:text-primary-700 underline font-medium bg-transparent border-none p-0 cursor-pointer"
                  >
                    Login
                  </button>{' '}
                  to access member-only courses and track your progress.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {courses.map((course) => {
              // Create the accessible course card content
              const accessibleCourseCard = (
                <div
                  key={course.id}
                  className="relative bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-large border border-primary-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                  onClick={() => handleCourseClick(course)}
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center mb-4 shadow-medium">
                      <span className="text-white text-2xl">{course.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-secondary-800">
                      {course.title}
                    </h3>
                    <p className="text-secondary-600 mb-4 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelBadgeClass(
                          course.level,
                        )}`}
                      >
                        {course.level}
                      </span>
                      <span className="text-sm text-secondary-500">
                        {course.duration}
                      </span>
                    </div>
                    <div className="text-sm text-secondary-600">
                      <strong>Instructor:</strong> {course.instructor}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-medium hover:shadow-large"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      Start Course
                    </button>
                  </div>
                </div>
              );

              // If course is free (no accessedByPlanIds), render it directly
              if (
                !course.accessedByPlanIds ||
                course.accessedByPlanIds.length === 0
              ) {
                return accessibleCourseCard;
              }

              // Create fallback with locked course component
              const fallback = (
                <LockedCourseCard
                  course={course}
                  planIds={course.accessedByPlanIds}
                />
              );

              return (
                <PricingPlans.PlanPaywall.Root
                  key={course.id}
                  planPaywallServiceConfig={{
                    requiredPlanIds: course.accessedByPlanIds,
                  }}
                >
                  <PricingPlans.PlanPaywall.Paywall>
                    <PricingPlans.PlanPaywall.RestrictedContent>
                      {accessibleCourseCard}
                    </PricingPlans.PlanPaywall.RestrictedContent>

                    <PricingPlans.PlanPaywall.Fallback>
                      {fallback}
                    </PricingPlans.PlanPaywall.Fallback>
                  </PricingPlans.PlanPaywall.Paywall>
                </PricingPlans.PlanPaywall.Root>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 shadow-large border border-primary-200">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-700 bg-clip-text text-transparent">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                Choose a subscription plan to unlock all premium courses and
                start your carpentry journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isLoggedIn && (
                  <>
                    <a
                      href="/pricing"
                      className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold shadow-large hover:shadow-xl hover:scale-105 transition-all duration-300 no-underline"
                    >
                      View Pricing Plans
                    </a>
                    {!isLoggedIn && (
                      <button
                        onClick={login}
                        className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-200 rounded-xl font-semibold shadow-medium hover:shadow-large hover:border-primary-300 transition-all duration-300"
                      >
                        Login to Continue
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoursesPageComponent;
