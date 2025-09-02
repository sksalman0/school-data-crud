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

  // Test DB connection at the beginning
  try {
    const conn = await getConnection();
    console.log("Successfully connected to DB");
    await conn.end();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed", details: err.message });
    return;
  }

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

    try {
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
          
        } catch (fileErr) {
          console.error("File processing error:", fileErr);
          res.status(500).json({ error: "Image processing failed", details: fileErr.message });
          return;
        }
      }

      // Insert into DB with base64 image data
      const conn = await getConnection();
      await conn.execute(
        "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          fields.name[0],
          fields.address[0],
          fields.city[0],
          fields.state[0],
          Number(fields.contact[0]), // ensure it's a number
          imageBase64,
          fields.email_id[0],
        ]
      );
      await conn.end();

      res.status(200).json({ success: true });
    } catch (dbErr) {
      console.error("DB ERROR:", dbErr);
      res.status(500).json({ error: "Database error", details: dbErr.message });
    }
  });
}
