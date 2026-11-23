import Database from "better-sqlite3";

// Create or connect to our database
export const db = new Database("app.db");

// Create the tasks table
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed INTEGER NOT NULL DEFAULT 0
  )
`);

console.log("Database connected successfully!");
