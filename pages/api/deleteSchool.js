import { getConnection } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: "School ID is required" });
  }

  try {
    const conn = await getConnection();
    
    // First check if school exists
    const [checkRows] = await conn.execute(
      "SELECT id FROM schools WHERE id = ?",
      [id]
    );
    
    if (checkRows.length === 0) {
      await conn.end();
      return res.status(404).json({ error: "School not found" });
    }
    
    // Delete the school
    await conn.execute("DELETE FROM schools WHERE id = ?", [id]);
    await conn.end();
    
    res.status(200).json({ success: true, message: "School deleted successfully" });
  } catch (e) {
    console.error("/api/deleteSchool DB error:", e);
    res.status(500).json({ error: "Database error", details: e.message });
  }
}
