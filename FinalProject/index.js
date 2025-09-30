import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

import { userRouter } from './routes/api/user.js';
import { ping } from './database.js';
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('frontend/dist'));
app.use('/api/user', userRouter);
//Get api user
app.use('/api/user', (await import('./routes/api/user.js')).userRouter);
ping();
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});