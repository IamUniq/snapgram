export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",
  GET_USER_FOLLOWERS = "getUserFollowers",
  GET_USER_FOLLOWINGS = "getUserFollowings",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_RELATED_POSTS = "getRelatedPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  GET_FILE_PREVIEW = "getFilePreview",

  // NOTIFICATION KEYS
  GET_NOTIFICATIONS = "getNotifications",

  //  SEARCH KEYS
  SEARCH_POSTS = "getSearchPosts",

  // COMMENT KEYS
  GET_COMMENTS = "getComments",
}
