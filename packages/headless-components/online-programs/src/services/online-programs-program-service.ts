// import { getProgramBySlug } from '@wix/online-programs';
import {
  defineService,
  implementService,
  type ServiceAPI,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
// import {
//   enhancePosts,
//   type PostWithResolvedFields,
// } from './blog-feed-service.js';

export interface Program {
  id: string;
}

export const OnlineProgramsProgramServiceDefinition = defineService<{
  program: Signal<Program>;
}>('onlineProgramsProgramService');

export type OnlineProgramsProgramServiceAPIServiceAPI = ServiceAPI<typeof OnlineProgramsProgramServiceDefinition>;

export const OnlineProgramsProgramService = implementService.withConfig<{
  program: Program;
}>()(OnlineProgramsProgramServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const programSignal = signalsService.signal<Program>(config.program);

  return {
    program: programSignal,
  };
});

export type OnlineProgramsProgramServiceConfig = ServiceFactoryConfig<
  typeof OnlineProgramsProgramService
>;

export type OnlineProgramsProgramServiceConfigResult =
  | {
      type: 'success';
      config: OnlineProgramsProgramServiceConfig;
    }
  | { type: 'notFound' };

type BlogPostServiceConfigParams = {
  programSlug: string;
};

export async function loadBlogPostServiceConfig(
  params: BlogPostServiceConfigParams,
): Promise<OnlineProgramsProgramServiceConfigResult> {
  const { programSlug } = params;

  if (!programSlug) {
    return { type: 'notFound' };
  }

  try {
    // const { program } = await programs.getProgramBySlug(programSlug);
    const program =  await new Promise<Program>(resolve => setTimeout(() => {
          resolve({
          id: "123",
          status: "PUBLISHED",
          categoryIds: [],
          description: {
              title: "10 Day Meditation Program",
              details: "Looking for a way to kick-off your meditation practice and start a long-lasting routine? Let go of all your misconceptions about meditation, tune into your breath and get ready to find complete balance and total Zen.\n \nIn this 10-day meditation journey, we will ease you into a routine and help you reap all of the benefits meditation has to offer. Each day we will focus on an aspect that links our mind to our body (and breath) to help you develop a practice that works for you! Beginning and sticking with our practice is not so easy, so let's start slow. We will start by devoting just 5 minutes a day for the first few days (preferably when you first wake in the am) and gradually work our way to 15+ minutes of mindfulness each day. We will learn how to tune into our breath, different breathing techniques, quieting the mind, noticing areas of tension and discomfort in the body, and discovering tools to amplify our meditation experience. We will also practice guided visualization meditations and have a brief introduction to our chakra system.\n \nEach day we will practice bringing our attention to the sensations in our body, to the fluctuations in our mind, and to the quality of our breath so that we may find peace and awareness within ourselves",
              image: {
                  id: "3b83d5_da62cb2820bc401fa6b9c18b2767a5b1~mv2.jpg",
                  url: "media/3b83d5_da62cb2820bc401fa6b9c18b2767a5b1~mv2.jpg",
                  height: 1277,
                  width: 1920,
                  altText: ""
              }
          },
          timeline: {
              "selfPaced": true
          },
          restrictions: {
              hideFutureSteps: false,
              resolveStepsInOrder: false,
              shareProgress: true,
              accessType: "PUBLIC"
          },
        } as Program);
    }, 200));


    if (!program) {
      return { type: 'notFound' };
    }

    // const [enhancedPost] = await enhancePosts([post]);

    // if (!enhancedPost) {
    //   return { type: 'notFound' };
    // }

    return {
      type: 'success',
      config: {
        program: program,
      },
    };
  } catch (error) {
    console.error('Failed to load initial program for slug', programSlug, error);
    return { type: 'notFound' };
  }
}
