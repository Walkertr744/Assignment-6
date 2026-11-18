import pool from "./database.js"; // Imports the PostgreSQL connection pool

//Retrieves all topics from the database
async function getAllTopics() {
    const result = await pool.query("SELECT * FROM topics");
     return result.rows; // Returns the records retrieved from the topics table
}

// Retrieves questions belonging to a specific topic, with optional filters
async function getQuestionByTopic(topic,limit,difficulty) {
    const topicResult = await pool.query( "SELECT id FROM topics WHERE name = $1", [topic]);

    // Returns null if the requested topic does not exist
    if (topicResult.rows.length === 0) {
        return null;
    }
    const topicId = topicResult.rows[0].id; // Retrieves the ID from the first matching topic

    let query = "SELECT * FROM questions WHERE topic_id = $1";
    let values = [topicId]; // Stores values that will prelace the SQL placeholders

    // Adds a difficulty filter only if one was provided
    if (difficulty) {
        query += " AND difficulty = $2";
        values.push(difficulty); // Adds the difficulty as the second SQL parameter
    }

    // Limits the number of returned questions if a limit was provided
    if (limit) {
        query += ` LIMIT $${values.length + 1}`;  // Determines the next placeholder number based on the existing parameters
        values.push(Number(limit)); // Converts the limit into a number and adds it to the parameters
    }

    const result = await pool.query(query, values);
    
    return result.rows;
}
// Retrieves one random question without exposing its answer
async function getRandomQuestion() {
    const result = await pool.query("SELECT id, topic_id, question, difficulty FROM questions ORDER BY RANDOM() LIMIT 1"); // Randomizes the rows and selects one question

    return result.rows;
}

// Retrieves a question using its unique ID
async function getQuestionById(id) {
     const idResult = await pool.query( "SELECT * FROM questions WHERE id = $1", [id]); // $1 represents the supplied question ID for input sanitation
     return idResult.rows[0]; // Returns the first matching question object instead of an array
}

// Adds a new question and creates its topic if necessary
async function addQuestion(topic, question, answer, difficulty) {
    let topicResult = await pool.query( "SELECT id FROM topics WHERE name = $1", [topic]);
        
    // Creates a new topic if one with that name does not already exist
        if (topicResult.rows.length === 0) {
            await pool.query("INSERT INTO topics (name) VALUES ($1)", [topic]);
        }
        
         // Retrieves the topic ID, including when the topic was just created
        topicResult = await pool.query("SELECT id FROM topics WHERE name = $1", [topic]);

    const topicId = topicResult.rows[0].id;

     // Inserts the new question and associates it with its topic through topic_id
    await pool.query("INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1,$2,$3,$4)",[topicId, question, answer, difficulty]);

    const newTable = await getQuestionByTopic(topic);

    return newTable;
}

// Allows the controller file to import these database functions
export {getAllTopics,getQuestionByTopic,getRandomQuestion,getQuestionById,addQuestion};