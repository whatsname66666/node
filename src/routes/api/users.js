import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
} from '../../controllers/userController.js';

import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// 所有路由都需要认证
router.use(authenticate);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  // .put(updateUser)
  // .delete(deleteUser);

export default router;