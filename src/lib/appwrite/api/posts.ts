import { ILikePost, INewPost, IUpdatePost } from "@/types";
import { ID, Query } from "appwrite";
import { appwriteConfig, databases, storage } from "../config";
import { createNotification } from "./users";
import { getUserFollowers } from "./following";

export async function createPost(post: INewPost) {
  const fileUrls: string[] = [];
  try {
    // upload image to storage
    const fileIds = await Promise.all(
      post.file.map(async (img) => {
        const uploadedFile = await uploadFile(img);

        if (!uploadedFile.data) throw Error("Error uploading file");

        return uploadedFile.data;
      })
    );

    if (!fileIds) throw Error;

    for (const id of fileIds) {
      const fileUrl = getFileView(id);

      if (!fileUrl.data) {
        deleteFile(id);
        throw Error;
      }

      fileUrls.push(fileUrl.data);
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrls: fileUrls,
        imageIds: fileIds,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await Promise.all(
        fileIds.map(async (id) => {
          await deleteFile(id);
        })
      );
      throw Error;
    }

    const userFollowers = await getUserFollowers(post.userId);

    if (!userFollowers) return newPost;

    for (const follower of userFollowers?.documents) {
      await createNotification({
        type: "newPost",
        targetId: follower.$id,
        userId: post.userId,
        postId: newPost.$id,
      });
    }

    return newPost;
  } catch (error) {
    console.error(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    if (!uploadedFile) throw Error("Failed to upload file")
    
    return {data: uploadedFile.$id}

    // const fileUrl = `${appwriteConfig.url}/storage/buckets/${appwriteConfig.storageId}/files/${uploadedFile.$id}?project=${appwriteConfig.projectId}`

    // return {fileId: uploadedFile.$id, fileUrl};
  } catch (error:any) {
    console.error(error);
    return {error: error.message}
  }
}

export function getFileView(fileId: string) {
  try {
    const fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)

    return {data: fileUrl}
  } catch (error:any) {
    return {error: error.message}
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts.documents;
  } catch (error) {
    console.error(error);
  }
}

export async function likePost({postId, targetId, userId, likesArray}: ILikePost) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    if (targetId && userId && (targetId !== userId)) {
      await createNotification({
        type: 'like',
        targetId,
        userId,
        postId
      }) 
    }

    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function savePost({postId, userId, targetId}: {[key: string]: string}) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    await createNotification({
      type: 'save',
      targetId,
      userId,
      postId
    })

    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getRelatedPosts(postId: string, tags: string[]) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.contains("tags", tags), Query.notEqual("$id", postId)]
    );

    if (!posts) throw Error;

    return posts.documents;
  } catch (error) {
    console.log("error");
  }
}

export async function getUserPosts(userId: string) {
  try {
    const userPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [
        Query.equal("creator", userId),
        // Query.select(["$id", "imageUrl", "creator.imageUrl"]),
        Query.orderDesc("$createdAt"),
      ]
    );

    if (!userPosts) throw Error;

    return userPosts;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  try {
    // Convert tags into an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Save post to database
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) queries.push(Query.cursorAfter(pageParam.toString()));

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts.documents;
  } catch (error) {
    console.log(error);
  }
}