// Server-side only database connection
let mysql;
let pool;

// Only import mysql2 on the server side
if (typeof window === 'undefined') {
  try {
    mysql = require('mysql2/promise');
  } catch (error) {
    console.error('Failed to import mysql2:', error);
  }
}

export async function getConnection() {
  if (typeof window !== 'undefined') {
    throw new Error('Database connection cannot be used on the client side');
  }
  
  if (!mysql) {
    throw new Error('mysql2 package not available');
  }

  // Check if environment variables are set
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Log connection attempt (remove in production)
  console.log('Attempting database connection with:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true'
  });

  try {
    // Use connection pool for better performance in production
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        connectTimeout: 10000, // 10 second timeout
        acquireTimeout: 10000,
        connectionLimit: 10,
        queueLimit: 0,
        waitForConnections: true,
        // Remove deprecated options that were causing warnings
      });
    }
    
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}