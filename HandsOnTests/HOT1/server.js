import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); //This sets up process.env.PORT
import debug from 'debug';
const debugServer = debug('app:Server');//Like a fancy console.log

import { incomeRouter } from './routes/api/income-tax/calc.js';
import { MPGRouter } from './routes/api/mpg/calc.js';
import { tempRouter } from './routes/api/temperature/convert.js';

const app = express();

app.use(express.urlencoded({extended: true})); //no reqs work without this
app.use(express.json());//needed for req.body

app.use(express.static('frontend/dist'));
app.use('/api/mpg/', MPGRouter);
app.use('/api/temp/', tempRouter);
app.use('/api/incomeTax/', incomeRouter);

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    debugServer(`server is now running on port http://localhost:${port}`);
});

