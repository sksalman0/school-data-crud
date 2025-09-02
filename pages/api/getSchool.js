import { getConnection } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: "School ID is required" });
  }

  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      "SELECT id, name, address, city, state, contact, email_id, image, created_at FROM schools WHERE id = ?",
      [id]
    );
    await conn.end();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "School not found" });
    }
    
    res.status(200).json(rows[0]);
  } catch (e) {
    console.error("/api/getSchool DB error:", e);
    res.status(500).json({ error: "Database error", details: e.message });
  }
}
