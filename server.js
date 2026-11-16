import express from 'express';
import pool from './models/database.js';
import triviaRouter from './routes/triviabook.js'

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

try {
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully!');
} catch (error) {
    console.error('Database connection failed:', error.message);
}

app.use('/triviabook', triviaRouter);

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});

