import express from 'express';
import {register, login, verifyToken, getAllUsers} from './user.controller.js'
import {authenticateToken, authorizeRole} from '../middleware/auth.middleware.js'

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/verify', authenticateToken, verifyToken);
userRouter.get('/get-all-users', authenticateToken, authorizeRole(['admin']), getAllUsers);

export default userRouter;