import express from 'express';
import {
  getMoviesList,
} from '../../controllers/exampleControllers.js';


const router = express.Router();

router.post('/movieList', getMoviesList);

export default router;