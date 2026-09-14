import express from 'express';
import cors from 'cors';
import { connectDB, sequelize } from './db.connect.js';
import userRouter from './user/user.route.js';
import justificationRouter from './justification/justification.route.js';


const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/users', userRouter);
app.use('/api/absence-justifications', justificationRouter);

app.listen(3000, async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log('Server is running on port 3000');
});
export {app};