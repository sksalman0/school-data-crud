-- Fix Database Schema for Base64 Image Storage
-- Run this script to update your existing schools table

-- First, backup your existing data (if any)
-- CREATE TABLE schools_backup AS SELECT * FROM schools;

-- Drop the existing table if it exists
DROP TABLE IF EXISTS schools;

-- Create the new table with proper column types
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  contact BIGINT NOT NULL,
  email_id VARCHAR(255) NOT NULL,
  image LONGTEXT, -- Store base64 encoded image data (can handle up to 4GB)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_schools_city ON schools(city);
CREATE INDEX idx_schools_state ON schools(state);

-- If you had data in the backup table, you can restore it here:
-- INSERT INTO schools (name, address, city, state, contact, email_id, created_at)
-- SELECT name, address, city, state, contact, email_id, created_at FROM schools_backup;
