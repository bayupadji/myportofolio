import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Determine SQLite DB file path (in project root)
const DB_FILE_PATH = path.join(process.cwd(), "portfolio.db");

// Singleton connection across hot reloads in Next.js development
declare global {
  var __portfolio_sqlite_db: BetterSQLite3Database<typeof schema> | undefined;
  var __portfolio_sqlite_raw: Database.Database | undefined;
}

function seedInitialAnalytics(sqlite: Database.Database) {
  try {
    const row = sqlite.prepare("SELECT COUNT(*) as count FROM page_views").get() as { count: number } | undefined;
    if (row && row.count > 0) return;

    const insert = sqlite.prepare(`
      INSERT INTO page_views (id, path, referrer, visitor_hash, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const now = new Date();
    const paths = [
      { path: "/", weight: 38 },
      { path: "/work", weight: 24 },
      { path: "/work/fintech-payment-experience", weight: 14 },
      { path: "/about", weight: 12 },
      { path: "/services", weight: 8 },
      { path: "/contact", weight: 4 },
    ];

    const referrers = [
      { source: "https://www.linkedin.com/", weight: 36 },
      { source: null, weight: 32 }, // Direct
      { source: "https://github.com/", weight: 16 },
      { source: "https://www.google.com/", weight: 10 },
      { source: "https://x.com/", weight: 6 },
    ];

    const insertMany = sqlite.transaction(() => {
      for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
        const date = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Realistic variation with upward growth trend
        const baseHits = isWeekend ? 38 : 68;
        const trendBonus = Math.floor((30 - dayOffset) * 0.9);
        const randomHits = Math.floor(baseHits + trendBonus + Math.sin(dayOffset * 0.8) * 12 + Math.random() * 15);

        const uniqueVisitorsCount = Math.max(12, Math.floor(randomHits * (0.58 + Math.random() * 0.12)));
        const dailyVisitors = Array.from({ length: uniqueVisitorsCount }, (_, i) => `vis-${dayOffset}-${i}`);

        for (let hit = 0; hit < randomHits; hit++) {
          const id = `pv-${dayOffset}-${hit}-${Math.random().toString(36).substring(2, 7)}`;

          // Path
          const randP = Math.random() * 100;
          let cumulativeP = 0;
          let selectedPath = "/";
          for (const p of paths) {
            cumulativeP += p.weight;
            if (randP <= cumulativeP) {
              selectedPath = p.path;
              break;
            }
          }

          // Referrer
          const randR = Math.random() * 100;
          let cumulativeR = 0;
          let selectedRef: string | null = null;
          for (const r of referrers) {
            cumulativeR += r.weight;
            if (randR <= cumulativeR) {
              selectedRef = r.source;
              break;
            }
          }

          const visitorHash = dailyVisitors[hit % dailyVisitors.length];
          const hitTime = new Date(date);
          hitTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

          insert.run(id, selectedPath, selectedRef, visitorHash, hitTime.toISOString());
        }
      }
    });

    insertMany();
  } catch (e) {
    console.error("Failed to seed initial analytics:", e);
  }
}

function initializeDatabase(): {
  db: BetterSQLite3Database<typeof schema>;
  sqlite: Database.Database;
} {
  if (global.__portfolio_sqlite_db && global.__portfolio_sqlite_raw) {
    return {
      db: global.__portfolio_sqlite_db,
      sqlite: global.__portfolio_sqlite_raw,
    };
  }

  // Ensure database directory exists if path is custom
  const dbDir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const sqlite = new Database(DB_FILE_PATH);

  // Performance and concurrency pragmas
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("synchronous = NORMAL");

  // Create tables automatically if they do not exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      role TEXT NOT NULL,
      duration TEXT NOT NULL,
      team TEXT NOT NULL,
      platforms TEXT NOT NULL,
      tools TEXT NOT NULL,
      category TEXT NOT NULL,
      cover_url TEXT NOT NULL,
      metrics TEXT NOT NULL,
      tldr TEXT NOT NULL,
      sections TEXT NOT NULL,
      solution_states TEXT NOT NULL,
      learnings TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      is_sample_project INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      published_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profile (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      headline TEXT NOT NULL,
      summary TEXT NOT NULL,
      location TEXT NOT NULL,
      email TEXT NOT NULL,
      avatar_url TEXT NOT NULL,
      cv_url TEXT NOT NULL,
      availability_status TEXT NOT NULL,
      is_available_for_freelance INTEGER NOT NULL DEFAULT 1,
      social_links TEXT NOT NULL,
      key_metrics TEXT NOT NULL,
      hero_role TEXT,
      hero_headline TEXT,
      hero_value_statement TEXT,
      featured_project_ids TEXT,
      process_steps TEXT,
      cta_banner TEXT
    );

    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      period TEXT NOT NULL,
      location TEXT NOT NULL,
      bullets TEXT NOT NULL,
      skills_used TEXT NOT NULL,
      logo_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      group_name TEXT NOT NULL,
      name TEXT NOT NULL,
      level TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      target_audience TEXT NOT NULL,
      deliverables TEXT NOT NULL,
      process_steps TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'available'
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      topic TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      referrer TEXT,
      visitor_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at);
    CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path);
  `);

  const initialUsername = (process.env.ADMIN_USERNAME || "skyviadmin").trim();
  const initialPassword = process.env.ADMIN_PASSWORD;

  if (!initialPassword && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD environment variable is required in production.");
  }

  const passwordToSeed = initialPassword || "skyvi1234";

  try {
    sqlite
      .prepare(`
        INSERT INTO admin_users (id, username, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(username) DO NOTHING
      `)
      .run(
        `admin-${initialUsername}`,
        initialUsername,
        hashPassword(passwordToSeed),
        "admin",
        new Date().toISOString()
      );
  } catch (err) {
    console.error("Error ensuring initial admin user:", err);
  }

  // Seed initial 30 days of traffic analytics if table is fresh
  try {
    seedInitialAnalytics(sqlite);
  } catch (err) {
    console.error("Error seeding initial analytics:", err);
  }

  const db = drizzle(sqlite, { schema });

  if (process.env.NODE_ENV !== "production") {
    global.__portfolio_sqlite_db = db;
    global.__portfolio_sqlite_raw = sqlite;
  }

  return { db, sqlite };
}

import crypto from "crypto";

export function hashPassword(
  password: string,
  salt = crypto.randomBytes(16).toString("hex")
): string {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(":");
    if (!salt || !originalHash) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(originalHash, "hex")
    );
  } catch {
    return false;
  }
}

const { db, sqlite } = initializeDatabase();

// Seed initial content once on startup if the database is fresh
import("./seed").then(({ seedDatabaseIfEmpty }) => {
  seedDatabaseIfEmpty().catch((err) => {
    console.error("Error seeding initial database content:", err);
  });
});

export { db, sqlite };

