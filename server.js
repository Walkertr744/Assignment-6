import express from 'express'; // Imports express to create the web server
import pool from './models/database.js'; // Imports the postgress connection pool
import triviaRouter from './routes/triviabook.js' // Imports the API Routes

const app = express(); // Creates the express application
const PORT = process.env.PORT || 3001; // Uses hosting platforms port or defaults to 3001

app.use(express.json()); // Allows express to read JSON data sent in req bodies
app.use(express.static('public')); // Serves the html, css, and js files from the public folder

//Tests the db connection when the server starts
try {
    await pool.query('SELECT NOW()'); // Executes a simple SQL query to verify connection
    console.log('Database connected successfully!');
} catch (error) {
    console.error('Database connection failed:', error.message);
}

app.use('/triviabook', triviaRouter);

app.listen(PORT, () =>{ // Starts the server and listens for requests on the specified port
    console.log(`Server running on port ${PORT}`);
});

