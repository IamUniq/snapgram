import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import {
  INewPost,
  INewUser,
  IUpdatePost,
  IUpdateUser,
  INewComment,
  IFollowUser,
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
  getUsers,
  signInAccount,
  signOutAccount,
  updateUser,
  getUserById,
} from "../appwrite/api/users";

import {
  createPost,
  deletePost,
  deleteSavedPost,
  getInfinitePosts,
  getPostById,
  getUserPosts,
  getRecentPosts,
  likePost,
  savePost,
  searchPosts,
  updatePost,
  createComment,
  getComments,
  likeComment,
  deleteComment,
  getRelatedPosts,
} from "../appwrite/api/posts";

import {
  followUser,
  unFollowUser,
  isFollowingUser,
  getUserFollowers,
  getUserFollowings,
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
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
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
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
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
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      }),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: INewComment) => createComment(comment),
    onSuccess: (data) =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      }),
  });
};

export const useGetComments = (postId: string) => {
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
      commentId,
      likesArray,
    }: {
      commentId: string;
      likesArray: string[];
    }) => likeComment(commentId, likesArray),
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

export const useFollowUser = (info: IFollowUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => followUser(info),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, data?.followerId.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWINGS, data?.followingId.$id],
      });
    },
  });
};

export const useUnFollowUser = (data: IFollowUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unFollowUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, data?.followerId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWINGS, data?.followingId],
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
    queryKey: ["getUserFollowers", userId],
    queryFn: () => getUserFollowers(userId),
    enabled: !!userId,
  });
};

export const useGetUserFollowings = (userId: string) => {
  return useQuery({
    queryKey: ["getUserFollowings", userId],
    queryFn: () => getUserFollowings(userId),
    enabled: !!userId,
  });
};
