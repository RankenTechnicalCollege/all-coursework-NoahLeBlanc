import express from 'express';

const router = express.Router();


import debug from 'debug';

const debugUser = debug('app:UserRouter');

router.use(express.urlencoded({extended:false}));
//FIXME: user this array to store user data in for now
//we will replace this with a database in a later assigment 

import { nanoid } from 'nanoid';
const userArray = [
    {email: 'sarah.martin@example.com', password: 'OceanBreeze92!', givenName: 'Sarah', familyName: 'Martin', role: 'Teacher', assignedBug: null, userId: nanoid()},
    {email: 'alex.jones@example.com', password: 'SkyDive!73', givenName: 'Alex', familyName: 'Jones', role: 'Admin', assignedBug: null, userId: nanoid()},
    {email: 'jasmine.wu@example.com', password: 'LotusFlower#11', givenName: 'Jasmine', familyName: 'Wu', role: 'Student', assignedBug: null, userId: nanoid()},
    {email: 'michael.ross@example.com', password: 'RocketMan*44', givenName: 'Michael', familyName: 'Ross', role: 'Student', assignedBug: null, userId: nanoid()},
    {email: 'emily.nguyen@example.com', password: 'Sunshine_2025', givenName: 'Emily', familyName: 'Nguyen', role: 'Teacher', assignedBug: null, userId: nanoid()},
];

//--------------------------------Router Gets----------------------------
//You must list static routes before dynamic routes

router.get('/list', (req,res) => {
    res.json(userArray);
});
router.get("/:userId", (req,res) =>{
    //reads the userId from the URL and stores in a bar
    const userId = req.params.userId;
    const user = userArray.find(user => user.userId == userId)
    if(user){
        res.status(200).json(user);
    }else{
        res.status(404).send('user not found')
    }
});

//--------------------------------Router Posts---------------------------

router.post('/register', (req,res) =>{
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
    const search = userArray.find(user => user.email === newUser.email);
    if(search != undefined){
        res.status(400).type('text/plain').send('Email already registered');
        return;
    }

    newUser.userId = nanoid();
    console.log(newUser)
    userArray.push(newUser);
    res.status(200).json({message: `New User ${newUser.givenName} Registered!`});
});

router.post('/login', (req,res) =>{
    const user = req.body;
    if(!user.email){
        res.status(400).type('text/plain').send('Email is required');
        return;
    }
    else if(!user.password){
        res.status(400).type('text/plain').send('Password is required');
        return;
    }
    else{
        const search = userArray.find(u => u.email === user.email && u.password === user.password);
        if(search){
            res.status(200).json('User logged in succesfully');
        }
        else{
            res.status(401).send('Invalid credentials');
        }
    }
});

//--------------------------------Router Put---------------------------

router.put('/:userId', (req,res) =>{
    const id = req.params.userId; //sending data with params

    const userToUpdate = userArray.find(user => user.userId == id);

    const updatedUser = req.body; // sennding data with body

    if(userToUpdate){
        for(const key in updatedUser){
            userToUpdate[key] = updatedUser[key];
        }
            //save updated user in the users array
        const index = userArray.findIndex(user => user.userId == id);
        if(index != -1){
            userArray[index] = userToUpdate
        }
        res.status(200).send(`user ${id} updated successfully`)
    }
    else{
        res.status(404).send(`user not found`)
    }

});
 
//--------------------------------Router Delete---------------------------

router.delete('/:userId', (req,res) =>{
    const id = req.params.userId;
    const index = userArray.findIndex(user => user.userId == id);

    if(index != -1){
        userArray.splice(index,1);//start at index, remove one element
        res.status(200).send(`User ${id} deleteted succesfully`);
    }else{
        res.status(404).send(`User not found`)
    }
});

export {router as userRouter}
export {userArray as userArray}