import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import {
  IFollowUser,
  ILikePost,
  INewComment,
  INewPost,
  INewStory,
  INewUser,
  IUpdatePost,
  IUpdateUser,
} from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createUserAccount,
  getCurrentUser,
  getNotifications,
  getUserById,
  getUsers,
  signInAccount,
  signOutAccount,
  updateNotifications,
  updateUser,
} from "../appwrite/api/users";

import {
  createPost,
  createStory,
  deletePost,
  deleteSavedPost,
  getInfinitePosts,
  getPostById,
  getRecentPosts,
  getRelatedPosts,
  getUserPosts,
  getUserStories,
  likePost,
  savePost,
  searchPosts,
  updatePost,
} from "../appwrite/api/posts";

import {
  createComment,
  createReply,
  deleteComment,
  getComments,
  getReplies,
  likeComment,
  likeReply
} from "../appwrite/api/comments";

import {
  followUser,
  getUserFollowers,
  getUserFollowings,
  isFollowingUser,
  unFollowUser,
} from "../appwrite/api/following";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignoutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      }),
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: () => getRecentPosts(),
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      targetId,
      userId,
      likesArray,
    }: ILikePost) => likePost({postId, targetId, userId, likesArray}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId, targetId }: { postId: string; userId: string, targetId: string }) =>
      savePost({postId, userId, targetId}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

export const useGetRelatedPosts = (postId: string, tags: string[]) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RELATED_POSTS, postId],
    queryFn: () => getRelatedPosts(postId, tags),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      }),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      }),
  });
};

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

      return lastId;
    },
    initialPageParam: null,
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (user) =>{
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER, user.data?.$id],
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, user.data?.$id],
      })
    }
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, creatorId }: { data: INewComment;  creatorId: string}) => createComment(data, creatorId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS, data?.post.$id],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.post.$id],
        });
    },
  });
};

export const useGetPostComments = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMENTS, postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      likesArray,
    }: {
      contentId: string;
      likesArray: string[];
    }) => likeComment(contentId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
      }),
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, creatorId }: { data: INewComment; creatorId: string }) => createReply(data, creatorId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENT_REPLIES, data?.comment.$id],
      })
    },
  });
};

export const useLikeReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      likesArray,
    }: {
      contentId: string;
      likesArray: string[];
    }) => likeReply(contentId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENT_REPLIES, data?.comment.$id],
      });
    },
  });
};

export const useGetCommentReplies = (commentId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMENT_REPLIES, commentId],
    queryFn: () => getReplies(commentId),
    enabled: !!commentId,
  });
};

export const useFollowUser = (info: IFollowUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => followUser(info),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWINGS],
      });
    },
  });
};

export const useUnFollowUser = (userData: IFollowUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unFollowUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWINGS],
      });
    },
  });
};

export const useIsFollowingUser = (data: IFollowUser) => {
  return useQuery({
    queryKey: ["isFollowingUser", data.followerId, data.followingId],
    queryFn: () => isFollowingUser(data),
    enabled: !!data.followerId && !!data.followingId,
  });
};

export const useGetUserFollowers = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, userId],
    queryFn: () => getUserFollowers(userId),
    enabled: !!userId,
  });
};

export const useGetUserFollowings = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWINGS, userId],
    queryFn: () => getUserFollowings(userId),
    enabled: !!userId,
  });
};

export const useGetNotifications = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_NOTIFICATIONS, userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
  });
}

export const useUpdateNotifications = (notificationIds: string[]) => {
  return useMutation({
    mutationFn: () => updateNotifications(notificationIds),
  });
}

export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewStory) => createStory(post),
    onSuccess: (data) =>{
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, data?.userId],
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.userId],
      })
    }
  });
};

export const useGetUserStories = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_STORIES],
    queryFn: () => getUserStories(userId),
    enabled: !!userId,
  });
};