import { Router } from "express";
import { getTopics,getQuestions, getRandom, checkAnswer, addNewQuestion } from "../controllers/topicControl.js";

const  router = Router();

router.get('/topics', getTopics);
router.get('/topic/:topic',getQuestions);
router.get('/random',getRandom);
router.post('/answer',checkAnswer);
router.post('/question/add',addNewQuestion)

export default router;