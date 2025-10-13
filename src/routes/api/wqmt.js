import express from 'express';
import {
  getMusicList,
} from '../../controllers/wqmtControllers.js';


const router = express.Router();

router.post('/musicList', getMusicList);

export default router;