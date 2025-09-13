export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructor: string;
  icon: string;
  accessedByPlanIds?: string[];
  isFree?: boolean;
}

export enum PlanId {
  Beginner = '299f81f5-2b7a-45dd-8d2b-76fa5d11dbc6',
  AllCourses = '2665235f-7ba7-42f9-a663-fdc4b08e41b4',
  Premium = 'd8ebf32e-3b9b-4c5e-9700-b082dd3cc168',
}

const baseCourses = [
  {
    id: 'intro-woodworking',
    title: 'Introduction to Woodworking',
    description:
      'Learn the fundamentals of woodworking, including tool safety, wood selection, and basic techniques.',
    level: 'Beginner' as const,
    duration: '4 weeks',
    instructor: 'Master Johnson',
    icon: '🪵',
    isFree: true,
  },
  {
    id: 'basic-joinery',
    title: 'Basic Joinery Techniques',
    description:
      'Master essential joinery methods including mortise and tenon, dovetails, and finger joints.',
    level: 'Beginner' as const,
    duration: '6 weeks',
    instructor: 'Master Smith',
    icon: '🔨',
  },
  {
    id: 'advanced-joinery',
    title: 'Advanced Joinery & Complex Joints',
    description:
      'Explore sophisticated joinery techniques for professional-grade woodworking projects.',
    level: 'Advanced' as const,
    duration: '8 weeks',
    instructor: 'Master Wilson',
    icon: '⚒️',
  },
  {
    id: 'furniture-design',
    title: 'Furniture Design & Planning',
    description:
      'Learn to design and plan furniture projects from concept to completion.',
    level: 'Intermediate' as const,
    duration: '5 weeks',
    instructor: 'Master Davis',
    icon: '📐',
  },
  {
    id: 'finishing-techniques',
    title: 'Wood Finishing Techniques',
    description:
      'Master various wood finishing methods to protect and beautify your projects.',
    level: 'Intermediate' as const,
    duration: '3 weeks',
    instructor: 'Master Taylor',
    icon: '🎨',
  },
  {
    id: 'cabinet-making',
    title: 'Professional Cabinet Making',
    description:
      'Build custom cabinets with precision joinery and professional finishing techniques.',
    level: 'Advanced' as const,
    duration: '12 weeks',
    instructor: 'Master Anderson',
    icon: '🗄️',
  },
];

export const demoCourses: Course[] = baseCourses.map((course) => {
  if (course.isFree) {
    return {
      ...course,
      accessedByPlanIds: [],
    } as Course;
  }

  if (course.level === 'Beginner') {
    return {
      ...course,
      accessedByPlanIds: [PlanId.Beginner, PlanId.AllCourses, PlanId.Premium],
    } as Course;
  }

  if (course.level === 'Intermediate') {
    return {
      ...course,
      accessedByPlanIds: [PlanId.AllCourses, PlanId.Premium],
    } as Course;
  }

  if (course.level === 'Advanced') {
    return {
      ...course,
      accessedByPlanIds: [PlanId.Premium],
    } as Course;
  }

  return course as Course;
});

export const getCourseById = (id: string): Course | undefined => {
  return demoCourses.find((course) => course.id === id);
};

export const getAllCourses = (): Course[] => {
  return demoCourses;
};
