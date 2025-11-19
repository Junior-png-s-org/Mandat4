import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Pour avoir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ouvrir la base SQLite
export async function openDB() {
  return open({
    filename: path.join(__dirname, "../../basededonnee.sqlite3"),
    driver: sqlite3.Database
  });
}
