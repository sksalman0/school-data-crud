import { getConnection } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  
  console.log('getSchools API called');
  
  let conn;
  try {
    console.log('Attempting to get database connection...');
    conn = await getConnection();
    console.log('Database connection successful, executing query...');
    
    // Return all fields as per the database schema
    const [rows] = await conn.execute(
      "SELECT id, name, address, city, state, contact, image, email_id FROM schools ORDER BY id ASC"
    );
    
    console.log(`Query successful, found ${rows.length} schools`);
    
    res.status(200).json(rows);
  } catch (e) {
    console.error("/api/getSchools DB error:", e);
    console.error("Error details:", {
      message: e.message,
      stack: e.stack,
      code: e.code,
      errno: e.errno,
      sqlState: e.sqlState
    });
    
    // Send appropriate error response
    if (e.message.includes('Missing required environment variables')) {
      res.status(500).json({ 
        error: "Database configuration error", 
        details: "Environment variables not properly configured" 
      });
    } else if (e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND') {
      res.status(500).json({ 
        error: "Database connection failed", 
        details: "Cannot connect to database server" 
      });
    } else if (e.code === 'ER_ACCESS_DENIED_ERROR') {
      res.status(500).json({ 
        error: "Database authentication failed", 
        details: "Invalid database credentials" 
      });
    } else {
      res.status(500).json({ 
        error: "Database error", 
        details: e.message 
      });
    }
  } finally {
    // Always release the connection back to the pool
    if (conn) {
      try {
        await conn.release();
        console.log('Database connection released back to pool');
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
  }
}
