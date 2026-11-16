import pool from "./database.js";

async function getAllTopics() {
    const result = await pool.query("SELECT * FROM topics");
     return result.rows;
}

async function getQuestionByTopic(topic,limit,difficulty) {
    const topicResult = await pool.query( "SELECT id FROM topics WHERE name = $1", [topic]);
    if (topicResult.rows.length === 0) {
        return null;
    }
    const topicId = topicResult.rows[0].id;
    let query = "SELECT * FROM questions WHERE topic_id = $1";
    let values = [topicId];

    if (difficulty) {
        query += " AND difficulty = $2";
        values.push(difficulty);
    }

    if (limit) {
        query += ` LIMIT $${values.length + 1}`;
        values.push(Number(limit));
    }

    const result = await pool.query(query, values);
    
    return result.rows;
}

async function getRandomQuestion() {
    const result = await pool.query("SELECT id, topic_id, question, difficulty FROM questions ORDER BY RANDOM() LIMIT 1");
    return result.rows;
}

async function getQuestionById(id) {
     const idResult = await pool.query( "SELECT * FROM questions WHERE id = $1", [id]);
     return idResult.rows[0];
}

async function addQuestion(topic, question, answer, difficulty) {
    let topicResult = await pool.query( "SELECT id FROM topics WHERE name = $1", [topic]);

        if (topicResult.rows.length === 0) {
            await pool.query("INSERT INTO topics (name) VALUES ($1)", [topic]);
        }
        
        topicResult = await pool.query("SELECT id FROM topics WHERE name = $1", [topic]);

    const topicId = topicResult.rows[0].id;

    await pool.query("INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1,$2,$3,$4)",[topicId, question, answer, difficulty]);

    const newTable = await getQuestionByTopic(topic);

    return newTable;
}

export {getAllTopics,getQuestionByTopic,getRandomQuestion,getQuestionById,addQuestion};