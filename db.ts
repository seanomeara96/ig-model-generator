import sqlite3 from 'sqlite3';

let db: sqlite3.Database | null = null;

export function getDatabaseInstance(): sqlite3.Database {
  if (!db) {
    db = new sqlite3.Database('main.db');
  }

  return db;
}

