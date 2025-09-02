-- Database Schema for School Management System
-- This table stores images as base64 encoded strings in the database

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  contact BIGINT NOT NULL,
  email_id VARCHAR(255) NOT NULL,
  image LONGTEXT, -- Store base64 encoded image data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for better performance
CREATE INDEX idx_schools_city ON schools(city);
CREATE INDEX idx_schools_state ON schools(state);
