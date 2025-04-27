import { INewComment } from "@/types";
import { appwriteConfig, databases } from "../config";
import { ID, Models, Query } from "appwrite";
import { createNotification } from "./users";

export async function createComment(data: INewComment, postCreatorId: string) {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        commenter: data.commenterId,
        post: data.contentId,
        quote: data.quote,
      }
    );

    if (!newComment) throw Error;

    if (data.commenterId !== postCreatorId) {
      await createNotification({
        type: "comment",
        targetId: postCreatorId,
        userId: data.commenterId,
        postId: data.contentId,
      })
    }

    return newComment;
  } catch (error) {
    console.log(error);
  }
}

export async function getComments(postId: string) {
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [
        Query.equal("post", postId),
      ]
    );

    if (!comments) throw Error;

    const commentsWithReplies:Models.Document[] = []

    for (const comment of comments.documents) {
      const replies = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.repliesCollectionId,
        [Query.equal("comment", comment.$id), Query.select(['$id'])]
      )

      commentsWithReplies.push({
        ...comment,
        replies: replies.total
      })
    }

    return commentsWithReplies;
  } catch (error) {
    console.log(error);
  }
}

export async function likeComment(commentId: string, likes: string[]) {
  try {
    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId,
      {
        likes: likes,
      }
    );

    if (!updatedComment) throw Error;

    return updatedComment;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteComment(commentId: string) {
  try {
    const commentToDelete = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );

    if (!commentToDelete) throw Error;

    return { success: true };
  } catch (error) {
    console.log(error);
  }
}

export async function createReply(data: INewComment, commentCreatorId: string) {
  try {
    const replyCreated = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      ID.unique(),
      {
        quote: data.quote,
        commenter: data.commenterId,
        comment: data.contentId
      }
    )

    if (!replyCreated) throw Error("Failed to create reply")
    
    if (data.commenterId !== commentCreatorId) {
      await createNotification({
        type: "reply",
        targetId: commentCreatorId,
        userId: data.commenterId,
        postId: data.contentId,
      })
    }
    
    return replyCreated
  } catch (error) {
    console.log(error)
  }
}

export async function getReplies(commentId: string) {
  try {
    const replies = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      [
        Query.equal("comment", commentId),
        // Query.select([
        //   "$id",
        //   "quote",
        //   "likes",
        //   "$createdAt",
        //   "commenter.$id",
        //   "commenter.name",
        //   "commenter.imageUrl",
        // ]),
      ]
    );

    if (!replies) throw Error;

    return replies;
  } catch (error) {
    console.log(error);
  }
}

export async function likeReply(replyId: string, likes: string[]) {
  try {
    const updatedReply = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      replyId,
      {
        likes: likes,
      }
    );

    if (!updatedReply) throw Error;

    return updatedReply;
  } catch (error) {
    console.log(error);
  }
}