import Database from "better-sqlite3";
import path from "path";

const DB_FILE_PATH = path.join(process.cwd(), "portfolio.db");

export function getTestDb(): Database.Database {
  return new Database(DB_FILE_PATH);
}

/**
 * Removes any temporary test records inserted during E2E runs.
 * Matches IDs or slugs prefixed with 'test-' or 'e2e-'.
 */
export function cleanupE2ETestData(): void {
  try {
    const db = getTestDb();
    db.prepare("DELETE FROM projects WHERE id LIKE 'test-%' OR id LIKE 'e2e-%' OR slug LIKE 'test-%' OR slug LIKE 'e2e-%'").run();
    db.prepare("DELETE FROM messages WHERE id LIKE 'test-%' OR id LIKE 'e2e-%' OR email LIKE '%@playwright.test'").run();
    db.prepare("DELETE FROM services WHERE id LIKE 'test-%' OR id LIKE 'e2e-%' OR slug LIKE 'test-%'").run();
    db.close();
  } catch (err) {
    console.warn("Failed to cleanup test data:", err);
  }
}
