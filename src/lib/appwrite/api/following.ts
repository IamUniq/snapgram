import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { IFollowUser } from "@/types";

export async function isFollowingUser(data: IFollowUser) {
  try {
    const following = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", data.followerId),
        Query.equal("followingId", data.followingId),
        Query.select(["$id"]),
      ]
    );

    if (!following) throw Error;

    return {
      isFollowing: following.documents.length > 0,
      $id: following.documents.length > 0 ? following.documents[0].$id : "",
    };
  } catch (error) {
    console.log(error);
    return { isFollowing: false, $id: "" };
  }
}

export async function followUser(data: IFollowUser) {
  try {
    const isAlreadyFollowingUser = await isFollowingUser(data);

    if (isAlreadyFollowingUser?.isFollowing) return;

    const followingUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      { ...data }
    );

    if (!followingUser) throw Error;

    return followingUser;
  } catch (error) {
    console.log(error);
  }
}

export async function unFollowUser(data: IFollowUser) {
  try {
    const following = await isFollowingUser(data);

    if (!following) throw Error;

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      following.$id
    );

    return { success: true };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserFollowers(userId: string) {
  try {
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", userId),
        Query.select([
          "$id",
          "followingId.name",
          "followingId.username",
          "followingId.$id",
          "followingId.imageUrl",
        ]),
      ]
    );

    if (!followers) throw Error;

    const documents = followers.documents.map((doc) => {
      return {
        $id: doc.$id,
        name: doc.followingId.name,
        username: doc.followingId.username,
        userId: doc.followingId.$id,
        imageUrl: doc.followingId.imageUrl,
      };
    });

    const data = {
      documents: documents,
      total: followers.total,
    };

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserFollowings(userId: string) {
  try {
    const followings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followingId", userId),
        Query.select([
          "$id",
          "followerId.name",
          "followerId.username",
          "followerId.$id",
          "followerId.imageUrl",
        ]),
      ]
    );

    if (!followings) throw Error;

    const documents = followings.documents.map((doc) => {
      return {
        $id: doc.$id,
        name: doc.followerId.name,
        username: doc.followerId.username,
        userId: doc.followerId.$id,
        imageUrl: doc.followerId.imageUrl,
      };
    });

    const data = {
      documents: documents,
      total: followings.total,
    };

    return data;
  } catch (error) {
    console.log(error);
  }
}
