import { getConnection } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  
  console.log('testDb API called');
  
  let conn;
  try {
    // Check environment variables
    const envCheck = {
      DB_HOST: process.env.DB_HOST ? '✅ Set' : '❌ Missing',
      DB_USER: process.env.DB_USER ? '✅ Set' : '❌ Missing',
      DB_PASSWORD: process.env.DB_PASSWORD ? '✅ Set' : '❌ Missing',
      DB_NAME: process.env.DB_NAME ? '✅ Set' : '❌ Missing',
      DB_PORT: process.env.DB_PORT || '3306 (default)',
      DB_SSL: process.env.DB_SSL || 'false (default)',
      NODE_ENV: process.env.NODE_ENV || 'development',
      VERCEL_ENV: process.env.VERCEL_ENV || 'Not on Vercel'
    };
    
    console.log('Environment variables check:', envCheck);
    
    // Test database connection
    console.log('Testing database connection...');
    conn = await getConnection();
    
    // Test a simple query
    const [result] = await conn.execute('SELECT 1 as test');
    console.log('Database query test successful:', result);
    
    // Get database info
    const [dbInfo] = await conn.execute('SELECT DATABASE() as current_db, VERSION() as version');
    console.log('Database info:', dbInfo);
    
    // Check if schools table exists and count records
    let tableInfo = { exists: false, recordCount: 0 };
    try {
      const [countResult] = await conn.execute('SELECT COUNT(*) as count FROM schools');
      tableInfo = { exists: true, recordCount: countResult[0].count };
    } catch (tableError) {
      tableInfo = { exists: false, error: tableError.message };
    }
    
    const response = {
      status: 'success',
      message: 'Database connection and query test successful',
      environment: envCheck,
      database: {
        connected: true,
        info: dbInfo[0],
        schoolsTable: tableInfo
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('Test completed successfully:', response);
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Database test failed:', error);
    
    const errorResponse = {
      status: 'error',
      message: 'Database test failed',
      error: {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState
      },
      environment: {
        DB_HOST: process.env.DB_HOST ? '✅ Set' : '❌ Missing',
        DB_USER: process.env.DB_USER ? '✅ Set' : '❌ Missing',
        DB_PASSWORD: process.env.DB_PASSWORD ? '✅ Set' : '❌ Missing',
        DB_NAME: process.env.DB_NAME ? '✅ Set' : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV || 'development',
        VERCEL_ENV: process.env.VERCEL_ENV || 'Not on Vercel'
      },
      timestamp: new Date().toISOString()
    };
    
    res.status(500).json(errorResponse);
  } finally {
    if (conn) {
      try {
        await conn.release();
        console.log('Test connection released');
      } catch (releaseError) {
        console.error('Error releasing test connection:', releaseError);
      }
    }
  }
}
