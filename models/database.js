import pg from 'pg'; // Import postgress

const pool = new pg.Pool({ // Create a pool of reusable database connections
    connectionString: process.env.DATABASE_URL // Retrieves the database connection url from the .env file
});

export default pool; // Allows other files to import and use the database connection pool