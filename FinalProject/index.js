import express from 'express';
import dotenv from 'dotenv'
dotenv.config(); //This sets up process.env.PORT
import debug from 'debug';

const debugServer = debug('app:Server');//Like a fancy console.log

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.static('frontend/dist'));

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    debugServer(`server is now running on port http://localhost:${port}`);
});

app.get('/api', (req, res) =>{
    res.send('Hello World from the back end route')
});