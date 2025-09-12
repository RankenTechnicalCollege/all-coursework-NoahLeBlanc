import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); //This sets up process.env.PORT
import debug from 'debug';
const debugServer = debug('app:Server');//Like a fancy console.log

import { calcRouter } from './routes/api/mpg/calc.js';//this is a route

const app = express();

app.use(express.urlencoded({extended: true})); //no reqs work without this
app.use(express.json());//needed for req.body

app.use(express.static('frontend/dist'));
app.use('/api/mpg/', calcRouter);

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    debugServer(`server is now running on port http://localhost:${port}`);
});

