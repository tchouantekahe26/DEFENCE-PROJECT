import express from 'express';
import { getMessages, sendMessage } from './chat.controller.js';

const chatRouter = express.Router();

chatRouter.get('/', getMessages);
chatRouter.post('/', sendMessage);

export default chatRouter;
