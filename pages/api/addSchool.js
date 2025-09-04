import { getConnection } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("addSchool API called");

  let conn;
  try {
    const { name, address, city, state, contact, email_id, imageUrl } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'address', 'city', 'state', 'contact', 'email_id'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Field '${field}' is required` });
      }
    }

    // Get database connection
    conn = await getConnection();
    console.log("Successfully connected to DB");

    // Insert into DB with image URL
    console.log("Inserting school data into database...");
    const [result] = await conn.execute(
      "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        name.trim(),
        address.trim(),
        city.trim(),
        state.trim(),
        Number(contact),
        imageUrl || '', // Store image URL or empty string
        email_id.trim(),
      ]
    );

    console.log("School added successfully with ID:", result.insertId);
    res.status(200).json({
      success: true,
      message: "School added successfully",
      schoolId: result.insertId,
    });

  } catch (dbErr) {
    console.error("DB ERROR:", dbErr);
    res.status(500).json({
      error: "Database error",
      details: dbErr.message,
      code: dbErr.code,
      errno: dbErr.errno,
    });
  } finally {
    // Always release the connection back to the pool
    if (conn) {
      try {
        await conn.release();
        console.log("Database connection released back to pool");
      } catch (releaseError) {
        console.error("Error releasing connection:", releaseError);
      }
    }
  }
}

