-- Fix the image column to properly handle base64 encoded images
-- Run this script on your database to fix the column type issue

-- First, backup your existing data (if any)
-- CREATE TABLE schools_backup AS SELECT * FROM schools;

-- Check current table structure
DESCRIBE schools;

-- Alter the image column to LONGTEXT (can handle up to 4GB)
ALTER TABLE schools MODIFY COLUMN image LONGTEXT;

-- Verify the change
DESCRIBE schools;

-- If you need to recreate the table completely, uncomment these lines:
-- DROP TABLE IF EXISTS schools;
-- CREATE TABLE schools (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   address TEXT NOT NULL,
--   city VARCHAR(100) NOT NULL,
--   state VARCHAR(100) NOT NULL,
--   contact BIGINT NOT NULL,
--   email_id VARCHAR(255) NOT NULL,
--   image LONGTEXT, -- Store base64 encoded image data (can handle up to 4GB)
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE INDEX idx_schools_city ON schools(city);
-- CREATE INDEX idx_schools_state ON schools(state);
