# 🧹 Delete Old Stories – Appwrite Function

This Appwrite Cloud Function automatically deletes user stories older than 24 hours from the Appwrite database. It is designed to be scheduled via a cron job and helps keep story data fresh and optimized.

---

## 📦 Tech Stack

- **Runtime:** Node.js 18
- **Language:** JavaScript (ESModules)
- **Appwrite SDK:** v16+

---

## ⚙️ Environment Variables

This function requires the following environment variables to be set via the Appwrite Console:

- DATABASE_ID
- STORIES_COLLECTION_ID
- STORAGE_ID

---

## ⏱️ Schedule

This function is intended to run **every 24 hours**. It uses this cron expression:

```

0 0 \* \* \*

````

> This runs the function once per day at midnight UTC.

---

## 🧠 How It Works

1. Fetches all documents in the stories collection.
2. Filters for stories with a `createdAt` timestamp older than 24 hours.
3. Deletes them using the Appwrite SDK.