import { comments } from '@wix/comments';
import { members } from '@wix/members';
import { defineService, implementService, type ServiceAPI } from '@wix/services-definitions';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';

const DEFAULT_PAGE_SIZE = 5;
const BLOG_APP_ID = '14bcded7-0066-7c35-14d7-466cb3f09103';

export interface CommentResolvedFields {
  author: members.Member | null | undefined;
  parentAuthor: members.Member | null | undefined;
}

const ROOT_ID = 'ROOT';
type RootCommentId = typeof ROOT_ID;

export interface CommentWithResolvedFields extends comments.Comment {
  resolvedFields: CommentResolvedFields;
}

type RawQueryCommentsSortField = NonNullable<comments.CommentSort['order']>;

const supportedSortFields = [
  'NEWEST_FIRST',
  'OLDEST_FIRST',
] as const satisfies RawQueryCommentsSortField[];

type QueryCommentsSortField = Extract<
  RawQueryCommentsSortField,
  (typeof supportedSortFields)[number]
>;

export type QueryCommentsSort = {
  fieldName: QueryCommentsSortField;
};

type LoadingState = 'initial' | 'saving' | 'more' | false;

type ThreadState = {
  comments: CommentWithResolvedFields[];
  isLoading: LoadingState;
  nextCursor?: string | undefined;
  error?: string | null;
};

type RecordWithRoot<T> = Record<RootCommentId | (string & {}), T>;

/** Serves as a cache for member objects to avoid duplicate calls to the members service */
type RecordOfMembers = Record<string, members.Member | null | undefined>;

export const BlogPostCommentsServiceDefinition = defineService<{
  isEmpty: (commentId?: string) => boolean;
  hasNextPage: (commentId?: string) => boolean;
  isLoading: (commentId?: string) => LoadingState;
  getComments: (commentId?: string) => CommentWithResolvedFields[];
  getComment: (commentId: string) => CommentWithResolvedFields | undefined;
  getError: (commentId?: string) => string | null;
  initialLoad: () => Promise<void>;
  sort: Signal<QueryCommentsSort[]>;
  setSort: (sort: QueryCommentsSort[]) => void;
  createComment: (content: comments.CommentContent) => Promise<CommentWithResolvedFields | null>;
  createReply: (
    /** Determines which comment will have the replied addded to */
    topCommentId: string,
    /** Determines the parent comment of the reply (nested) */
    parentCommentId: string,
    content: comments.CommentContent,
  ) => Promise<CommentWithResolvedFields | null>;
  deleteComment: (commentId: string) => Promise<void>;
  loadMore: () => Promise<void>;
  loadMoreReplies: (commentId: string) => Promise<void>;
}>('blogPostCommentsService');

export type BlogPostCommentsServiceAPI = ServiceAPI<typeof BlogPostCommentsServiceDefinition>;

export type BlogPostCommentsServiceConfig = {
  postReferenceId: string;
  pageSize: number;
  sort: QueryCommentsSort[];
};

export const BlogPostCommentsService = implementService.withConfig<BlogPostCommentsServiceConfig>()(
  BlogPostCommentsServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const threadStatesSignal = signalsService.signal<RecordWithRoot<ThreadState>>({
      [ROOT_ID]: { comments: [], isLoading: false },
    });
    const sortSignal = signalsService.signal(config.sort);

    const getComments = (threadId?: string): CommentWithResolvedFields[] => {
      const threadStates = threadStatesSignal.get();
      const _commentId = threadId || ROOT_ID;
      return threadStates[_commentId]?.comments ?? [];
    };

    const getComment = (commentId: string): CommentWithResolvedFields | undefined => {
      const threadStates = threadStatesSignal.get();
      const rootComments = threadStates[ROOT_ID]?.comments ?? [];
      const allThreadComments = rootComments.flatMap((comment) => {
        if (comment._id) {
          return threadStates[comment._id]?.comments ?? [];
        }
        return [];
      });
      const allComments = [...rootComments, ...allThreadComments];

      return allComments.find((comment) => comment._id === commentId);
    };

    const getAllComments = (): CommentWithResolvedFields[] => {
      return Object.values(threadStatesSignal.get()).flatMap((threadState) => threadState.comments);
    };

    const getHasLeafComments = (commentId: string): boolean => {
      const allComments = getAllComments();
      return allComments.some((comment) => comment.parentComment?._id === commentId);
    };

    const findThreadStateByCommentId = (
      commentId: string,
    ):
      | {
          threadState: ThreadState;
          threadStateId: string | RootCommentId;
        }
      | undefined => {
      const threadState = Object.entries(threadStatesSignal.get()).find(([, threadState]) =>
        threadState.comments.some((comment) => comment._id === commentId),
      );

      return threadState
        ? { threadStateId: threadState[0], threadState: threadState[1] }
        : undefined;
    };

    const getMemberMap = (): RecordOfMembers => {
      const allComments = getAllComments();

      const membersMap: RecordOfMembers = {};

      for (const comment of allComments) {
        if (comment.resolvedFields.author?._id) {
          membersMap[comment.resolvedFields.author._id] = comment.resolvedFields.author;
        }
        if (comment.resolvedFields.parentAuthor?._id) {
          membersMap[comment.resolvedFields.parentAuthor._id] = comment.resolvedFields.parentAuthor;
        }
      }

      return membersMap;
    };

    const setThreadState = {
      loading: (commentId: string | RootCommentId, isLoading: LoadingState) => {
        const threadState = threadStatesSignal.get()[commentId];
        const comments = threadState?.comments ?? [];

        threadStatesSignal.set({
          ...threadStatesSignal.get(),
          [commentId]: {
            comments,
            isLoading,
            nextCursor: threadState?.nextCursor,
            error: null,
          },
        });
      },
      loaded: (
        commentId: string | RootCommentId,
        items: CommentWithResolvedFields[],
        nextCursor?: string | null | undefined,
      ) => {
        threadStatesSignal.set({
          ...threadStatesSignal.get(),
          [commentId]: {
            comments: items,
            isLoading: false as const,
            nextCursor: nextCursor ?? undefined,
            error: null,
          },
        });
      },
      error: (commentId: string | RootCommentId, error: string) => {
        const threadState = threadStatesSignal.get()[commentId];
        threadStatesSignal.set({
          ...threadStatesSignal.get(),
          [commentId]: {
            ...threadState,
            comments: threadState?.comments ?? [],
            isLoading: false as const,
            error,
          },
        });
      },
    };

    const isLoading = (commentId?: string): LoadingState => {
      return threadStatesSignal.get()[commentId || ROOT_ID]?.isLoading ?? false;
    };

    const isEmpty = (commentId?: string): boolean => {
      return !isLoading(commentId) && getComments(commentId).length === 0;
    };

    const hasNextPage = (commentId?: string): boolean => {
      return !!getNextCursor(commentId);
    };

    const getError = (commentId?: string): string | null => {
      return threadStatesSignal.get()[commentId || ROOT_ID]?.error ?? null;
    };

    const getNextCursor = (commentId?: string): string | undefined => {
      return threadStatesSignal.get()[commentId || ROOT_ID]?.nextCursor;
    };

    // Actions
    const load = async (
      shouldLoadMore: boolean,
    ): Promise<
      | {
          items: CommentWithResolvedFields[];
          length: number;
          cursors: comments.Cursors;
        }
      | undefined
    > => {
      try {
        const nextCursor = getNextCursor();

        if (shouldLoadMore && !nextCursor) {
          console.warn(`No next cursor available for thread ${ROOT_ID.toString()}`);
          return;
        }

        setThreadState.loading(ROOT_ID, shouldLoadMore ? 'more' : 'initial');

        const result = await fetchComments({
          postReferenceId: config.postReferenceId,
          nextCursor: shouldLoadMore ? nextCursor : undefined,
          sort: sortSignal.get(),
          pageSize: config.pageSize || DEFAULT_PAGE_SIZE,
          memberMap: getMemberMap(),
        });

        const currentComments = getComments();
        const nextComments = shouldLoadMore
          ? mergePreserveOrderById(currentComments, result.items)
          : result.items;
        setThreadState.loaded(ROOT_ID, nextComments, result?.cursors?.next);

        for (const commentThread of result.commentThreads) {
          setThreadState.loaded(
            commentThread.parentCommentId,
            commentThread.comments,
            commentThread.nextCursor,
          );
        }

        return result;
      } catch (err) {
        console.error('Failed to load comments:', err);
        setThreadState.error(ROOT_ID, 'Failed to load comments');
      }
    };

    const initialLoad = async (): Promise<void> => {
      if (isLoading()) {
        return;
      }
      await load(false);
    };

    const setSort = async (sort: QueryCommentsSort[]): Promise<void> => {
      sortSignal.set(sort);
      await load(false);
    };

    const loadMore = async (): Promise<void> => {
      if (isLoading()) {
        return;
      }
      await load(true);
    };

    const loadMoreReplies = async (commentId: string): Promise<void> => {
      const nextCursor = getNextCursor(commentId);

      setThreadState.loading(commentId, nextCursor ? 'more' : 'initial');

      try {
        const response = await fetchReplies({
          commentId,
          postReferenceId: config.postReferenceId,
          pageSize: config.pageSize || DEFAULT_PAGE_SIZE,
          nextCursor,
          memberMap: getMemberMap(),
        });

        const currentCommentReplies = getComments(commentId);
        const nextCommentReplies = mergePreserveOrderById(currentCommentReplies, response.items);
        setThreadState.loaded(commentId, nextCommentReplies, response.cursors?.next);
      } catch (err) {
        console.error('Failed to load more replies:', err);

        setThreadState.error(commentId, 'Failed to load more replies');
      }
    };

    const createComment = async (
      content: comments.CommentContent,
    ): Promise<CommentWithResolvedFields | null> => {
      try {
        setThreadState.loading(ROOT_ID, 'saving');

        const newComment = await comments.createComment({
          appId: BLOG_APP_ID,
          contextId: config.postReferenceId,
          resourceId: config.postReferenceId,
          content,
        });

        const { members: resolvedMembers } = await fetchCommentEntities(
          [newComment],
          getMemberMap(),
        );
        const enhancedNewComment = toEnhancedComment(newComment, resolvedMembers);

        const threadState = threadStatesSignal.get()[ROOT_ID];
        // Add to the beginning of the comments list
        const currentComments = threadState.comments;
        const updatedComments = mergePreserveOrderById([enhancedNewComment], currentComments);

        setThreadState.loaded(ROOT_ID, updatedComments, threadState.nextCursor);

        return enhancedNewComment;
      } catch (err) {
        console.error('Failed to create comment:', err);
        setThreadState.error(ROOT_ID, 'Failed to create comment');
        return null;
      }
    };

    const createReply = async (
      /** Determines which comment will have the replied addded to */
      topCommentId: string,
      /** Determines the parent comment of the reply (nested) */
      parentCommentId: string,
      content: comments.CommentContent,
    ): Promise<CommentWithResolvedFields | null> => {
      try {
        const targetThread = topCommentId ?? parentCommentId;

        setThreadState.loading(parentCommentId, 'saving');

        const newReply = await comments.createComment({
          appId: BLOG_APP_ID,
          contextId: config.postReferenceId,
          resourceId: config.postReferenceId,
          content,
          parentComment: {
            _id: parentCommentId,
          },
        });

        const { members: resolvedMembers } = await fetchCommentEntities([newReply], getMemberMap());
        const enhancedReply = toEnhancedComment(newReply, resolvedMembers);

        const rootThreadState = threadStatesSignal.get()[ROOT_ID];
        const rootComments = rootThreadState?.comments ?? [];

        const nextRootComments = rootComments.map((comment) => {
          if (comment._id === parentCommentId || comment._id === topCommentId) {
            return {
              ...comment,
              replyCount: (comment.replyCount ?? 0) + 1,
            };
          }

          return comment;
        });

        const parentThread = threadStatesSignal.get()[targetThread];
        const currentThreadComments = parentThread?.comments ?? [];

        // Store new comment in top thread
        setThreadState.loaded(
          topCommentId,
          mergePreserveOrderById(currentThreadComments, [enhancedReply]),
          parentThread?.nextCursor,
        );

        // Update "saving" state for parent comment (reply form saving state)
        setThreadState.loaded(
          parentCommentId,
          threadStatesSignal.get()[parentCommentId]?.comments ?? [],
          threadStatesSignal.get()[parentCommentId]?.nextCursor,
        );

        // Update replyCount
        setThreadState.loaded(ROOT_ID, nextRootComments, rootThreadState?.nextCursor);

        return enhancedReply;
      } catch (err) {
        setThreadState.error(parentCommentId, 'Failed to create reply');

        return null;
      }
    };

    const deleteComment = async (commentIdToDelete: string): Promise<void> => {
      try {
        setThreadState.loading(commentIdToDelete, 'saving');
        await comments.deleteComment(commentIdToDelete);

        const hasLeafComments = getHasLeafComments(commentIdToDelete);
        const commentIdThread = findThreadStateByCommentId(commentIdToDelete);

        if (!commentIdThread) {
          console.warn('Comment not found in any thread');
          return;
        }

        const nextComments = hasLeafComments
          ? commentIdThread.threadState.comments.map<CommentWithResolvedFields>((comment) =>
              comment._id === commentIdToDelete ? toDeletedComment(comment) : comment,
            )
          : commentIdThread.threadState.comments.filter(
              (comment) => comment._id !== commentIdToDelete,
            );

        setThreadState.loaded(
          commentIdThread.threadStateId,
          nextComments,
          commentIdThread.threadState.nextCursor,
        );
      } catch (err) {
        console.error('Failed to delete comment:', err);
        setThreadState.error(commentIdToDelete, 'Failed to delete comment');
      }
    };

    return {
      getComments,
      getComment,

      isEmpty,
      isLoading,
      hasNextPage,
      getError,
      loadMore,
      loadMoreReplies,

      initialLoad,
      sort: sortSignal,
      setSort,
      createComment,
      createReply,
      deleteComment,
    };
  },
);

type FetchCommentsParams = {
  sort: QueryCommentsSort[];
  postReferenceId: string;
  pageSize: number;
  nextCursor: string | undefined;
  memberMap: RecordOfMembers;
};

type ThreadWithResolvedFields = {
  parentCommentId: string;
  comments: CommentWithResolvedFields[];
  nextCursor?: string | undefined;
};

async function fetchComments(params: FetchCommentsParams): Promise<{
  items: CommentWithResolvedFields[];
  length: number;
  cursors: comments.Cursors;
  commentThreads: ThreadWithResolvedFields[];
}> {
  const options: comments.ListCommentsByResourceOptions = {
    contextId: params.postReferenceId,
    resourceId: params.postReferenceId,
    commentSort: {
      order: params.sort[0]?.fieldName || 'NEWEST_FIRST',
    },
    replySort: {
      order: 'OLDEST_FIRST',
      keepMarkedInOriginalOrder: false,
    },
    cursorPaging: {
      limit: params.pageSize,
      cursor: params.nextCursor,
      repliesLimit: 0,
    },
  };

  const response = await comments.listCommentsByResource(BLOG_APP_ID, options);
  const rawComments = response.comments || [];
  const rawReplies = Object.values(response.commentReplies ?? {}).flatMap(
    (replies) => replies.replies ?? [],
  );
  const { members: resolvedMembers } = await fetchCommentEntities(
    [...rawComments, ...rawReplies],
    params.memberMap,
  );

  const enhancedComments = rawComments.map((comment) =>
    toEnhancedComment(comment, resolvedMembers),
  );
  const commentThreads = Object.entries(response.commentReplies ?? {}).map(
    ([parentCommentId, replies]): ThreadWithResolvedFields => {
      return {
        parentCommentId,
        comments: (replies.replies ?? []).map((reply) => toEnhancedComment(reply, resolvedMembers)),
        nextCursor: replies.pagingMetadata?.cursors?.next ?? undefined,
      };
    },
  );

  return {
    items: enhancedComments,
    cursors: response.pagingMetadata?.cursors ?? { next: undefined, prev: undefined },
    length: response.comments?.length || 0,
    commentThreads,
  };
}

type FetchRepliesParams = {
  commentId: string;
  postReferenceId: string;
  pageSize: number;
  nextCursor: string | undefined;
  memberMap: RecordOfMembers;
};

async function fetchReplies(params: FetchRepliesParams): Promise<{
  items: CommentWithResolvedFields[];
  cursors: comments.Cursors;
}> {
  const nextCursor = params.nextCursor;

  if (!nextCursor) {
    console.warn(`No cursor available for comment ${params.commentId}`);
    return { items: [], cursors: { next: undefined, prev: undefined } };
  }

  const options: comments.ListCommentsByResourceOptions = {
    contextId: params.postReferenceId,
    resourceId: params.postReferenceId,
    cursorPaging: {
      limit: params.pageSize || DEFAULT_PAGE_SIZE,
      cursor: nextCursor,
    },
    replySort: {
      order: 'OLDEST_FIRST',
      keepMarkedInOriginalOrder: false,
    },
  };

  const response = await comments.listCommentsByResource(BLOG_APP_ID, options);
  const replies = response.comments ?? [];

  if (replies.length === 0) {
    console.warn(`No replies found for comment ${params.commentId}`);
    return { items: [], cursors: { next: undefined, prev: undefined } };
  }

  const { members: resolvedMembers } = await fetchCommentEntities(replies, params.memberMap);
  const enhancedReplies = replies.map((reply) => toEnhancedComment(reply, resolvedMembers));

  return {
    items: enhancedReplies,
    cursors: response.pagingMetadata?.cursors ?? { next: undefined, prev: undefined },
  };
}

function toDeletedComment(comment: CommentWithResolvedFields): CommentWithResolvedFields {
  return {
    ...comment,
    status: 'DELETED',
    content: undefined,
    author: undefined,
    resolvedFields: { author: undefined, parentAuthor: undefined },
  };
}

function toEnhancedComment(
  comment: comments.Comment,
  resolvedMembers: Record<string, members.Member | null | undefined>,
): CommentWithResolvedFields {
  // store draft content until it's approved
  const draftContent = (
    comment.status === 'PENDING' && 'draftContent' in comment ? comment.draftContent : undefined
  ) as comments.CommentContent | undefined;

  return {
    ...comment,
    content: comment.content ?? draftContent,
    resolvedFields: {
      author: comment.author?.memberId ? resolvedMembers[comment.author.memberId] : undefined,
      parentAuthor: comment.parentComment?.author?.memberId
        ? resolvedMembers[comment.parentComment.author.memberId]
        : undefined,
    },
  };
}

async function fetchCommentEntities(
  comments: comments.Comment[],
  memberMap: RecordOfMembers,
): Promise<{
  members: Record<string, members.Member | null | undefined>;
}> {
  const memberIdsToResolve = Array.from(
    new Set([
      ...uniqueFlatMapByKey(comments, 'author.memberId'),
      ...uniqueFlatMapByKey(comments, 'parentComment.author.memberId'),
    ]),
  );

  const memberPromises = memberIdsToResolve.map((memberId) => {
    if (memberId in memberMap && memberMap[memberId]) {
      return [memberId, memberMap[memberId]] as const;
    }

    return members
      .getMember(memberId)
      .then((response) => [memberId, response] as const)
      .catch((err) => {
        console.error(`Failed to resolve member ${memberId}`, err?.message);
        return [memberId, null] as const;
      });
  });

  const [resolvedMembers] = await Promise.all([Promise.all(memberPromises)]);

  return {
    members: Object.fromEntries(resolvedMembers),
  };
}

function nonNullable<T>(value: T): value is NonNullable<T> {
  return !!value;
}

function uniqueFlatMapByKey<T extends Record<string, any>, K extends string>(
  collection: T[],
  key: K,
): Array<string> {
  const values = collection
    .flatMap((item) => {
      const nestedValue = key.split('.').reduce((obj, prop) => obj?.[prop], item);
      return nestedValue || [];
    })
    .filter(nonNullable);

  const uniqueValues = [...new Set(values)];
  return uniqueValues;
}

function mergePreserveOrderById<T extends { _id?: string | null }>(items: T[], newItems: T[]): T[] {
  const map = new Map(items.map((item) => [item._id, item]));

  for (const newItem of newItems) {
    map.set(newItem._id, newItem);
  }

  const existingIds = new Set(items.map((item) => item._id));
  return [
    ...items.map((item) => map.get(item._id)!),
    ...newItems.filter((item) => !existingIds.has(item._id)),
  ];
}
