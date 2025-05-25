import { INewStory } from "@/types";
import { deleteFile, getFileView, uploadFile } from "./posts";
import { appwriteConfig, databases } from "../config";
import { ID, Query } from "appwrite";
import { getUserFollowers } from "./following";
import { createNotification } from "./users";

// STORY
export async function createStory(post: INewStory) {
  const isText = !(!post.text || post.text === "");
  try {
    let mediaUrl = "";
    let mediaId = "";

    if (!isText) {
      const file = await uploadFile(post.media!);
      if (!file.data) throw Error("Error uploading file");
      mediaId = file.data;

      const fileUrl = getFileView(file.data);

      if (!fileUrl.data) {
        deleteFile(file.data);
        throw Error;
      }

      mediaUrl = fileUrl.data;
    }

    const newStory = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.storiesCollectionId,
      ID.unique(),
      {
        user: post.userId,
        ...(!isText
          ? {
              mediaUrl,
              mediaId,
            }
          : {
              mediaText: post.text,
            }),
        mediaType: post.media ? post.media.type.split("/")[0] : "text",
      }
    );

    if (!newStory) {
      await deleteFile(mediaId);
      throw Error;
    }

    const data = {
      $id: newStory.$id,
      createdAt: newStory.$createdAt,
      mediaUrl: newStory.mediaUrl,
      userId: newStory.user.$id,
      mediaType: newStory.mediaType,
      text: newStory.mediaText,
    };

    const userFollowers = await getUserFollowers(post.userId);

    if (!userFollowers) return data;

    for (const follower of userFollowers?.documents) {
      await createNotification({
        type: "newStory",
        targetId: follower.$id,
        userId: post.userId,
        postId: newStory.$id,
      });
    }

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserStories(userId: string) {
  try {
    const now = new Date();
    const time24HoursAgo = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    ).toISOString();

    const userStories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.storiesCollectionId,
      [
        Query.equal("user", userId),
        Query.greaterThanEqual("$createdAt", time24HoursAgo),
        Query.select([
          "$id",
          "mediaId",
          "user.username",
          "user.imageUrl",
          "mediaText",
          "mediaUrl",
          "views",
          "mediaType",
          "highlight",
        ]),
        Query.orderDesc("$createdAt"),
      ]
    );

    if (!userStories) throw Error;

    return userStories;
  } catch (error) {
    console.log(error);
  }
}

export async function viewStory(storyId: string, views: string[]) {
  try {
    const updatedStory = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.storiesCollectionId,
      storyId,
      {
        views: views,
      }
    );

    if (!updatedStory) throw Error;

    return { id: updatedStory.$id };
  } catch (error) {
    console.log(error);
  }
}

export async function highlightStory({
  storyId,
  userId,
  title,
  mediaId,
  mediaUrl,
  mediaType,
}: {
  storyId: string;
  userId: string;
  title: string;
  mediaId: string;
  mediaUrl: string;
  mediaType: "video" | "image";
}) {
  try {
    const updatedStory = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.storiesCollectionId,
      storyId,
      {
        highlight: true,
      }
    );

    if (!updatedStory) throw Error;

    const highlight = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.highlightsCollectionId,
      ID.unique(),
      {
        user: userId,
        title,
        mediaId,
        mediaUrl,
        mediaType,
      }
    );

    if (!highlight) throw Error;

    return { title: highlight.title, userId: updatedStory.user.$id };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserHighlights(userId: string) {
  try {
    const userHighlights = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.highlightsCollectionId,
      [
        Query.equal("user", userId),
        Query.select(["$id", "title"]),
        Query.orderDesc("$createdAt"),
      ]
    );

    if (!userHighlights) throw Error;

    return userHighlights;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserHighlightByTitle(userId: string, title: string) {
  try {
    const titleFormatted = title.replace(/\-+/g, " ").trim();

    const highlight = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.highlightsCollectionId,
      [
        Query.equal("user", userId),
        Query.equal("title", titleFormatted),
        Query.select(["$id", "mediaId", "mediaUrl", "mediaType"]),
      ]
    );

    if (!highlight) throw Error;

    return highlight.documents;
  } catch (error) {
    console.log(error);
  }
}
