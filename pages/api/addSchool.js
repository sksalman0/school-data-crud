import { getConnection } from "../../lib/db";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  console.log("addSchool API called");

  const form = new IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 5 * 1024 * 1024; // 5MB limit

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      res.status(500).json({ error: "Form parse error", details: err.message });
      return;
    }

    console.log("FIELDS:", fields);
    console.log("FILES:", files);

    let conn;
    try {
      // Get database connection
      conn = await getConnection();
      console.log("Successfully connected to DB");

      // Handle image upload - convert to base64 and store in database
      let imageBase64 = "";
      const imageFile = files.image
        ? Array.isArray(files.image)
          ? files.image[0]
          : files.image
        : null;

      if (imageFile && imageFile.filepath) {
        try {
          // Check file size
          if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
            res.status(400).json({ error: "Image file too large. Maximum size is 5MB." });
            return;
          }

          // Read file and convert to base64
          const imageBuffer = fs.readFileSync(imageFile.filepath);
          const mimeType = imageFile.mimetype || 'image/jpeg';
          imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
          
          // Clean up temporary file
          fs.unlinkSync(imageFile.filepath);
          
          console.log("Image processed successfully, size:", imageBuffer.length);
        } catch (fileErr) {
          console.error("File processing error:", fileErr);
          res.status(500).json({ error: "Image processing failed", details: fileErr.message });
          return;
        }
      } else {
        console.log("No image file provided");
      }

      // Validate required fields
      const requiredFields = ['name', 'address', 'city', 'state', 'contact', 'email_id'];
      for (const field of requiredFields) {
        if (!fields[field] || !fields[field][0] || fields[field][0].trim() === '') {
          res.status(400).json({ error: `Field '${field}' is required` });
          return;
        }
      }

      // Insert into DB with base64 image data
      console.log("Inserting school data into database...");
      const [result] = await conn.execute(
        "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          fields.name[0].trim(),
          fields.address[0].trim(),
          fields.city[0].trim(),
          fields.state[0].trim(),
          Number(fields.contact[0]), // ensure it's a number
          imageBase64,
          fields.email_id[0].trim(),
        ]
      );

      console.log("School added successfully with ID:", result.insertId);
      res.status(200).json({ 
        success: true, 
        message: "School added successfully",
        schoolId: result.insertId 
      });

    } catch (dbErr) {
      console.error("DB ERROR:", dbErr);
      res.status(500).json({ 
        error: "Database error", 
        details: dbErr.message,
        code: dbErr.code,
        errno: dbErr.errno
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
  });
}
