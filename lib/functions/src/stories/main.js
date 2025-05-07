import { Databases, Query } from 'appwrite';
import { Client } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);
  
   const databases = new Databases(client);

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