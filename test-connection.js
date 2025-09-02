// Simple database connection test script
// Run with: node test-connection.js

const mysql = require('mysql2/promise');

async function testConnection() {
  let connection;
  
  try {
    console.log('Testing database connection...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'SchoolData',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
    
    console.log('✅ Database connection successful!');
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Basic query test passed:', rows);
    
    // Check if schools table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "schools"');
    if (tables.length > 0) {
      console.log('✅ Schools table exists');
      
      // Check table structure
      const [columns] = await connection.execute('DESCRIBE schools');
      console.log('✅ Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''}`);
      });
      
      // Count records
      const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM schools');
      console.log(`✅ Total schools in database: ${countResult[0].count}`);
      
      // Show sample data
      if (countResult[0].count > 0) {
        const [sampleData] = await connection.execute('SELECT id, name, city, state FROM schools LIMIT 3');
        console.log('✅ Sample data:');
        sampleData.forEach(school => {
          console.log(`  - ID: ${school.id}, Name: ${school.name}, Location: ${school.city}, ${school.state}`);
        });
      }
      
    } else {
      console.log('❌ Schools table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed');
    }
  }
}

// Run the test
testConnection().catch(console.error);
