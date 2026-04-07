import mariadb from "mariadb";
import dotenv from "dotenv";
dotenv.config();

console.log("Testing mariadb connection...");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD === undefined ? "undefined" : `"${process.env.DB_PASSWORD}"`);
console.log("DB_NAME:", process.env.DB_NAME);

const pool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  connectionLimit: 1,
  connectTimeout: 5000,
});

try {
  const conn = await pool.getConnection();
  console.log("✅ Connected successfully!");
  const rows = await conn.query("SELECT 1 as ping");
  console.log("✅ Query OK:", rows);
  conn.release();
} catch (err) {
  console.error("❌ Connection failed:");
  console.error("  Code:", err.code);
  console.error("  Message:", err.message);
  console.error("  Errno:", err.errno);
  console.error("  SqlState:", err.sqlState);
} finally {
  await pool.end();
}
