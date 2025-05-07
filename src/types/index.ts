export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateAccount = {
    email?: string;
  password?: string;
    newPassword?:string
    name?: string;
}

export type IUpdateUser = {
  userId: string;
  name?: string;
  username: string;
  email?: string;
  password?: string;
  newPassword?: string;
  imageId: string;
  imageUrl: URL | string;
  bio?: string;
  file: File[];
  followers?: string[];
  following?: string[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageIds: string[];
  imageUrls: URL[] | string[];
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  imageId: string;
  bio: string;
  accountId: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type INewComment = {
  commenterId: string;
  contentId: string;
  quote: string;
};

export type ILikePost = {
  postId: string;
  targetId?: string;
  userId?: string;
  likesArray: string[];
};

export type IFollowUser = {
  followerId: string;
  followingId: string;
};

export type INotification = {
  type: 'like' | 'comment' | 'follow' | 'share' | 'newPost' | 'save' | 'reply' | 'newStory';
  targetId: string;
  userId: string;
  postId?: string;
}

export type INewStory = {
  media: File
  userId: string;
};