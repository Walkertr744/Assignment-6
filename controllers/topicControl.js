import { getAllTopics,getQuestionByTopic, getRandomQuestion, getQuestionById, addQuestion } from "../models/topicMod.js";

async function getTopics(req, res) {
    const topics = await getAllTopics();
    res.status(200).json(topics);
}

async function getQuestions(req,res) {
    const topic = req.params.topic;
    const limit = req.query.limit;
    const difficulty = req.query.difficulty;

    if (difficulty !== undefined &&
        !["easy", "medium", "hard"].includes(difficulty)) {
        return res.status(400).json({error: "Invalid difficulty"});
    }

    if (limit !== undefined &&
        (!/^[1-9]\d*$/.test(limit) || !Number.isSafeInteger(Number(limit)))) {
        return res.status(400).json({error: "Invalid limit"});
    }

    const questions = await getQuestionByTopic(topic,limit,difficulty);
    if (questions === null){
        return res.status(404).json({error: "Topic not found"});
    }
    res.status(200).json(questions);
}

async function getRandom(req,res) {
    const result = await getRandomQuestion();
    res.status(200).json(result);
}

async function checkAnswer(req,res) {
    const id = req.body.id;
    const guess = req.body.guess;

    if (id === undefined || guess === undefined) {
        return res.status(400).json({error: "Missing id or guess"});
    }

    const quest = await getQuestionById(id);
    if (quest === undefined) {
        return res.status(404).json({error: "Question not found"});
    }

    const correct = guess.trim().toLowerCase() === quest.answer.trim().toLowerCase();

    res.json({
    correct: correct,
    answer: quest.answer
    });

}

async function addNewQuestion(req,res) {
    const topic = req.body.topic;
    const question = req.body.question;
    const answer = req.body.answer;
    const difficulty = req.body.difficulty;

    if (!topic || !question || !answer || !difficulty) {
        return res.status(400).json({error: "Missing required parameter"});
    }
    if(difficulty !== "easy" && difficulty !== "medium" && difficulty !== "hard"){
        return res.status(400).json({error: "Invalid difficulty"});
    }

    const updatedQuestions = await addQuestion(topic, question, answer, difficulty);

    res.status(200).json(updatedQuestions);
}
export {getTopics,getQuestions,getRandom,checkAnswer,addNewQuestion};