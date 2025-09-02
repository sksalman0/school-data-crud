import { getConnection } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  
  try {
    console.log("Checking database table structure...");
    const conn = await getConnection();
    
    // Check table structure
    const [columns] = await conn.execute("DESCRIBE schools");
    console.log("Table structure:", columns);
    
    // Check if table exists and has data
    const [countResult] = await conn.execute("SELECT COUNT(*) as count FROM schools");
    const count = countResult[0].count;
    console.log("Total schools in database:", count);
    
    await conn.end();
    
    res.status(200).json({ 
      success: true, 
      tableStructure: columns,
      totalSchools: count
    });
  } catch (error) {
    console.error("❌ Error checking table:", error);
    res.status(500).json({ 
      success: false, 
      error: "Error checking table", 
      details: error.message
    });
  }
}
