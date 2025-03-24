import express from 'express';
import {
    getScores,
    createScore,
    getTopScores,
    getUserScores,
    deleteUserScores
} from '../controllers/score.controller.js';

const router = express.Router();

router.get('/', getScores);

router.post('/', createScore);

router.get('/top', getTopScores);

router.get('/user/:userId', getUserScores);

router.delete('/user/:userId', deleteUserScores);

export default router; 