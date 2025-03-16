import { IFollowUser } from "@/types";
import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";

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

    if (isAlreadyFollowingUser?.isFollowing === true) return;

    const followingUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      { ...data }
    );

    if (!followingUser) throw Error;

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function unFollowUser(data: IFollowUser) {
  try {
    const isAlreadyFollowingUser = await isFollowingUser(data);

    if (isAlreadyFollowingUser?.isFollowing === false) return;

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      isAlreadyFollowingUser.$id
    );

    return {
      success: true,
      followerId: data.followerId,
      followingId: data.followingId,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserFollowers(userId: string) {
  try {
    const users = [];

    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followingId", userId),
        Query.orderDesc("$createdAt"),
        Query.select([
          "$id",
          "followerId.name",
          "followerId.username",
          "followerId.$id",
          "followerId.imageUrl",
        ]),
      ]
    );

    if (!followers) throw Error;

    // Appwrite doesn't return the $id of related records so we'll have to get it separately
    for (const user of followers.documents) {
      const userId = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [
          Query.equal("username", user.followerId.username),
          Query.select(["$id"]),
        ]
      );

      const data = {
        $id: userId.documents[0].$id,
        name: user.followerId.name,
        username: user.followerId.username,
        imageUrl: user.followerId.imageUrl,
        recordId: user.$id,
      };

      users.push(data);
    }

    const data = {
      documents: users,
      total: followers.total,
    };

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserFollowings(userId: string) {
  try {
    const users = [];

    const followings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", userId),
        Query.orderDesc("$createdAt"),
        Query.select([
          "$id",
          "followingId.name",
          "followingId.username",
          "followingId.$id",
          "followingId.imageUrl",
        ]),
      ]
    );

    if (!followings) throw Error;

    for (const user of followings.documents) {
      const userId = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [
          Query.equal("username", user.followingId.username),
          Query.select(["$id"]),
        ]
      );

      const data = {
        $id: userId.documents[0].$id,
        name: user.followingId.name,
        username: user.followingId.username,
        imageUrl: user.followingId.imageUrl,
        recordId: user.$id,
      };

      users.push(data);
    }

    const data = {
      documents: users,
      total: followings.total,
    };

    return data;
  } catch (error) {
    console.log(error);
  }
}
