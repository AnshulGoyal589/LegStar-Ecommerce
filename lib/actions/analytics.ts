import { getDb } from "@/lib/mongodb";

export async function recordVisit(ip: string, userAgent?: string) {
  const db = await getDb();
  const visitorsCol = db.collection("visitors");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  // We use an "upsert" so we don't count the same IP twice on the same day
  await visitorsCol.updateOne(
    { 
      ip: ip, 
      date: today 
    },
    { 
      $set: { 
        userAgent: userAgent,
        lastSeen: new Date() 
      } 
    },
    { upsert: true }
  );
}