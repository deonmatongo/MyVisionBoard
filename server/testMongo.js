import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "visionboard";

if (!uri) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await client.connect();

    // A lightweight command that proves connectivity + auth.
    const adminDb = client.db(dbName).admin();
    const ping = await adminDb.command({ ping: 1 });

    const db = client.db(dbName);
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();

    console.log("MongoDB connection: OK");
    console.log(`Database: ${dbName}`);
    console.log(`Ping: ${JSON.stringify(ping)}`);
    console.log(
      `Collections (${collections.length}): ${collections.map((c) => c.name).join(", ")}`
    );

    process.exit(0);
  } catch (err) {
    console.error("MongoDB connection: FAILED");
    console.error(err?.message || err);

    // Helpful hints for the most common Atlas misconfigurations.
    if (typeof err?.message === "string") {
      if (err.message.includes("bad auth") || err.message.includes("Authentication failed")) {
        console.error(
          "Hint: Check your MongoDB Atlas username/password in the connection string (URL-encode special characters in the password)."
        );
      }
      if (err.message.includes("IP") || err.message.includes("not authorized")) {
        console.error(
          "Hint: In MongoDB Atlas, add your current IP (or temporarily 0.0.0.0/0) under Network Access."
        );
      }
      if (err.message.includes("ENOTFOUND") || err.message.includes("getaddrinfo")) {
        console.error("Hint: DNS issue. Try a different network or check your internet.");
      }
    }

    process.exit(1);
  } finally {
    try {
      await client.close();
    } catch {
      // ignore
    }
  }
}

await main();
