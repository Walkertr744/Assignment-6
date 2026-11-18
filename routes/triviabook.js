import { Router } from "express"; // Imports Express Router to organize API endpoints
import { getTopics,getQuestions, getRandom, checkAnswer, addNewQuestion } from "../controllers/topicControl.js";

const  router = Router(); // Creates a router to define endpoints

//GET requests
router.get('/topics', getTopics); //Retrieves all topics
router.get('/topic/:topic',getQuestions); // Retrieves questions for a specified topic
router.get('/random',getRandom); // Retrieves a random question

//POST requests
router.post('/answer',checkAnswer); // Send the users guess to the controller to check
router.post('/question/add',addNewQuestion) // Sends a new database entry to the controller

export default router;  // Exports the router so server.js can use it