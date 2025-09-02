# School Management System

A Next.js application for managing school information with MySQL database integration.

## Features

- Add new schools with complete information
- View all schools in a responsive grid layout
- Image upload and storage
- MySQL database integration
- Responsive design with Tailwind CSS

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   DB_SSL=false
   ```

3. Set up MySQL database using `database_schema.sql`

4. Run the development server:
   ```bash
   npm run dev
   ```

## Vercel Deployment

### 1. Environment Variables

Set these environment variables in your Vercel dashboard:

- `DB_HOST`: Your production database host
- `DB_USER`: Your production database username
- `DB_PASSWORD`: Your production database password
- `DB_NAME`: Your production database name
- `DB_PORT`: Your production database port (usually 3306)
- `DB_SSL`: Set to `true` for production databases

### 2. Database Requirements

- Your production database must be accessible from Vercel's servers
- Use a cloud database service (PlanetScale, AWS RDS, Google Cloud SQL, etc.)
- Ensure SSL connections are properly configured
- The database user must have proper permissions

### 3. Common Issues & Solutions

#### Issue: "Cannot connect to database server"
**Solution**: 
- Check if your database host allows external connections
- Verify firewall rules allow Vercel's IP ranges
- Ensure SSL is properly configured if required

#### Issue: "Database authentication failed"
**Solution**:
- Verify database credentials in Vercel environment variables
- Check if the database user has proper permissions
- Ensure the user can connect from external hosts

#### Issue: "Missing required environment variables"
**Solution**:
- Double-check all environment variables are set in Vercel
- Variable names are case-sensitive
- Redeploy after setting environment variables

### 4. Testing Database Connection

Visit `/api/testDb` in your deployed app to test the database connection and see detailed diagnostic information.

### 5. Debugging

If data fetching isn't working:

1. Check Vercel function logs in the dashboard
2. Visit `/api/testDb` to test database connectivity
3. Verify environment variables are correctly set
4. Check if your database allows external connections
5. Ensure SSL configuration matches your database requirements

## API Endpoints

- `GET /api/getSchools` - Fetch all schools
- `POST /api/addSchool` - Add a new school
- `GET /api/testDb` - Test database connection
- `DELETE /api/deleteSchool` - Delete a school

## Database Schema

The application uses a `schools` table with the following structure:

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  contact BIGINT NOT NULL,
  email_id VARCHAR(255) NOT NULL,
  image LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Technologies Used

- Next.js 15
- React 19
- MySQL2
- Tailwind CSS
- Formidable (for file uploads)
- React Hook Form

## Support

For deployment issues:
1. Check Vercel function logs
2. Test database connection with `/api/testDb`
3. Verify environment variables
4. Ensure database accessibility from external sources
