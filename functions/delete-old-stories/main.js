import { Databases, Query } from 'appwrite';
import { Client } from 'node-appwrite';

// Appwrite function to automatically delete old stories
export default async ({ res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);
  
  const databases = new Databases(client);
  const storage = new Storage(client);

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  try {
    const stories = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.STORIES_COLLECTION_ID,
      [
        Query.lessThan("$createdAt", cutoff)
      ]
    );

    for (const story of stories.documents) {
      await storage.deleteFile(process.env.STORAGE_ID, story.mediaId);
      
      await databases.deleteDocument(
        process.env.DATABASE_ID,
        process.env.STORIES_COLLECTION_ID,
        story.$id
      );

    }

    return res.json({ deleted: stories.documents.length });
  } catch (e) {
    log(e);
    return res.send("Error", 500);
  }
};