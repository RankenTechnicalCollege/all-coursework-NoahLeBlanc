import express from 'express';
import { ObjectId } from 'mongodb';
//Database functions
import { getUsers, addUsers, searchUsers} from '../../database.js';
const router = express.Router();

import debug from 'debug';

const debugUser = debug('app:UserRouter');

router.use(express.urlencoded({extended:false}));

import { nanoid } from 'nanoid';
//--------------------------------Router Gets----------------------------
router.get('/list', async (req,res) => {
    const users = await getUsers();
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .send(JSON.stringify(users, null, 2));
});

router.get("/:userId", async (req,res) =>{
    //reads the userId from the URL and stores in a bar
    const userId = req.params.userId;
    let user = await searchUsers("_id", new ObjectId(userId))
    if(user){
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .send(JSON.stringify(user, null, 2));
    }else{
        res.status(404).send('user not found')
    }
});
////--------------------------------Router Posts---------------------------

router.post('/register', async (req,res) =>{
    //Req object has a body prop that contains the data sent by client
    const newUser = req.body;
    if(!newUser.email){
        res.status(400).send('email is required');
        return;
    }
    if(!newUser.password){
        res.status(400).type('text/plain').send('password is required');
        return;
    }
    if(!newUser.givenName){
        res.status(400).type('text/plain').send('Given Name is required');
        return;
    }
    if(!newUser.familyName){
        res.status(400).type('text/plain').send('Family Name is required');
        return;
    }
    if(!newUser.role){
        res.status(400).type('text/plain').send('role is required');
        return;
    }
    let search = await searchUsers("email", newUser.email)
    if(search != undefined){
        res.status(400).type('text/plain').send('Email already registered');
        return;
    }
    addUsers(newUser)
    res.status(200).json({message: `New User ${newUser.givenName} Registered!`});
}); 

//router.post('/login', (req,res) =>{
    //const user = req.body;
    //if(!user.email){
        //res.status(400).type('text/plain').send('Email is required');
        //return;
    //}
    //else if(!user.password){
        //res.status(400).type('text/plain').send('Password is required');
        //return;
    //}
    //else{
        //const search = userArray.find(u => u.email === user.email && u.password === user.password);
        //if(search){
            //res.status(200).json('User logged in succesfully');
        //}
        //else{
            //res.status(401).send('Invalid credentials');
        //}
    //}
//});

////--------------------------------Router Put---------------------------

//router.put('/:userId', (req,res) =>{
    //const id = req.params.userId; //sending data with params

    //const userToUpdate = userArray.find(user => user.userId == id);

    //const updatedUser = req.body; // sennding data with body

    //if(userToUpdate){
        //for(const key in updatedUser){
            //userToUpdate[key] = updatedUser[key];
        //}
            ////save updated user in the users array
        //const index = userArray.findIndex(user => user.userId == id);
        //if(index != -1){
            //userArray[index] = userToUpdate
        //}
        //res.status(200).send(`user ${id} updated successfully`)
    //}
    //else{
        //res.status(404).send(`user not found`)
    //}

//});
 
////--------------------------------Router Delete---------------------------

//router.delete('/:userId', (req,res) =>{
    //const id = req.params.userId;
    //const index = userArray.findIndex(user => user.userId == id);

    //if(index != -1){
        //userArray.splice(index,1);//start at index, remove one element
        //res.status(200).send(`User ${id} deleteted succesfully`);
    //}else{
        //res.status(404).send(`User not found`)
    //}
//});

export {router as userRouter}
//export {userArray as userArray}