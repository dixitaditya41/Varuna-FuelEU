import { db } from "../src/infrastructure/db/client";
import fs from "fs";
import path from "path";

async function migrate() {
  const schemaPath = path.join(__dirname, "../src/infrastructure/db/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  try {
    await db.query(sql);
    console.log(" Database migrated successfully");
  } catch (err) {
    console.error(" Migration failed:", err);
  } finally {
    await db.end();
  }
}

migrate();
