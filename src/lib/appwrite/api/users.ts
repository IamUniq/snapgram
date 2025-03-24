import { INewUser, INotification, IUpdateUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "../config";
import { deleteFile, getFilePreview, uploadFile } from "./posts";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {
    console.error("Error signing user in", error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function getUsers(limit?: number) {
  const queries: any[] = [
    Query.orderDesc("$createdAt"),
    Query.select(["$id", "name", "username", "imageUrl"]),
  ];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // upload image to storage
      const uploadedFile = await uploadFile(user.file[0]);

      if (!uploadedFile) throw Error;

      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      if (user.imageId !== null) deleteFile(user.imageId);

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user.userId,
      {
        name: user.name,
        username: user.username,
        bio: user.bio,
        ...image,
      }
    );

    if (!updatedUser) {
      await deleteFile(image.imageId);
      throw Error;
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function createNotification({type, targetId, userId, postId}: INotification) {
  try {
      const notification = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notificationsCollectionId,
      ID.unique(),
      {
        type,
        targetId,
        post: postId, 
        user: userId,
      }
    )

    if (!notification) throw Error
    
    return notification
  } catch (error) {
    console.log(error)
  }
}

export async function getNotifications(userId: string) {
  try {
    const notifications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.notificationsCollectionId,
      [
        Query.equal("targetId", userId),
        Query.orderDesc('$createdAt')
      ]
    );

    if (!notifications) throw Error;

    return notifications.documents;
  } catch (error) {
    console.log(error);
  }
}

export async function updateNotifications(notificationIds: string[]) {
  try {
    await Promise.all(
      notificationIds.map(async (notificationId) => {
        const updatedNotification = await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.notificationsCollectionId,
          notificationId,
          {
            read: true
          }
        );

        if(!updatedNotification) throw Error

        return {success: true}
      })
    );
  } catch (error) {
    console.log(error);
  }
}