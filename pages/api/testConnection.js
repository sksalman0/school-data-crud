import { getConnection } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  
  try {
    console.log("Testing database connection...");
    const conn = await getConnection();
    console.log("✅ Database connection successful!");
    
    // Test a simple query
    const [rows] = await conn.execute("SELECT 1 as test");
    console.log("✅ Database query successful:", rows);
    
    await conn.end();
    
    res.status(200).json({ 
      success: true, 
      message: "Database connection successful",
      test: rows[0]
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    res.status(500).json({ 
      success: false, 
      error: "Database connection failed", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
