import express from 'express';
import {register, login, verifyToken, getAllUsers, changePassword, updateUserProfile} from './user.controller.js'
import {authenticateToken, authorizeRole} from '../middleware/auth.middleware.js'

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/change-password', changePassword);
userRouter.put('/profile', updateUserProfile);
userRouter.get('/verify', authenticateToken, verifyToken);
userRouter.get('/get-all-users', authenticateToken, authorizeRole(['admin']), getAllUsers);

export default userRouter;