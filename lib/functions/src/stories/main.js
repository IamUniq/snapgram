import { Databases, Query } from 'appwrite';
import { Client } from 'node-appwrite';

const config = {
  databaseId: import.meta.DATABASE_ID,
  storageId: import.meta.STORAGE_ID,
  storiesCollectionId: import.meta.STORIES_COLLECTION_ID,
  apiKey: import.meta.APPWRITE_FUNCTION_API_KEY
}

// Appwrite function to automatically delete old stories
export default async ({ res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(config.apiKey);
  
  const databases = new Databases(client);
  const storage = new Storage(client);

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  try {
    const stories = await databases.listDocuments(
      config.databaseId,
      config.storiesCollectionId,
      [
        Query.lessThan("$createdAt", cutoff)
      ]
    );

    for (const story of stories.documents) {
      await storage.deleteFile(config.storageId, story.mediaId);
      
      await databases.deleteDocument(
        config.databaseId,
        config.storiesCollectionId,
        story.$id
      );

    }

    return res.json({ deleted: stories.documents.length });
  } catch (e) {
    log(e);
    return res.send("Error", 500);
  }
};