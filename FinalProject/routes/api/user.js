import express from 'express';
import { BSON, ObjectId } from 'mongodb';// Converts text id's to object _id's like in mongo
// Database functions
import {getCollection, hash} from '../../database.js';
const router = express.Router();

import debug from 'debug';
const debugUser = debug('app:UserRouter');

router.use(express.urlencoded({ extended: false }));
let userCollection = getCollection("users");

//Bycrypt stuff...
import bcrypt from 'bcrypt'
const saltRounds = 10;
bcrypt.genSalt(saltRounds, (err, salt) => {
if (err) {
    // Handle error
    return;
}});
// ------------------------------- Router GETs -------------------------------
router.get('/list', async (req, res) => {
  try {
    const users = await userCollection;        // this should already be a collection
    const allUsers = await users.find({},
        {projection:{
            id:1, 
            email:1, 
            familyName:1, 
            givenName:1, 
            createdBugs:1, 
            assignedBugs:1,
            role:1
        }}).toArray(); // convert cursor to array of docs

    res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .send(JSON.stringify(allUsers, null, 2)); // now safe to stringify

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get("/:userId", async (req, res) => {
  try {
        const id = new ObjectId(req.params.userId);

        const users = await userCollection;
        const user = await users.findOne({ _id: id },
            {projection:{
                       _id:1,
                       email:1,
                       familyName:1,
                       givenName:1, 
                       createdBugs:1, 
                       assignedBugs:1
            }}
        );

        if (!user) {
        throw new Error("User Not found");
        }
        res // Below formats it to look nicer
        .status(200)
        .setHeader("Content-Type", "application/json")
        .send(JSON.stringify(user, null, 2));
    }catch (err) {
    if (err.name === "BSONError") {// Handles BSON errors
      return res.status(400).json({ error: "Invalid user ID format" });
    }res.status(404).json({ error: err.message });
  }});

// ------------------------------- Router POSTs ------------------------------
router.post('/register', async (req, res) => {
  const newUser = req.body;

  // Validation
  if (!newUser.email) return res.status(400).send('email is required');
  if (!newUser.password) return res.status(400).send('password is required');
  if (!newUser.givenName) return res.status(400).send('Given Name is required');
  if (!newUser.familyName) return res.status(400).send('Family Name is required');
  if (!newUser.role) return res.status(400).send('role is required');

  const users = await userCollection; 
  const search = await users.findOne({ email: newUser.email });

  if (search) {
    return res.status(400).send('Email already registered');
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = hashedPassword;

    await users.insertOne(newUser);

    res.status(201).json({ message: `New User ${newUser.givenName} Registered!` });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("Internal Server Error");
  }
});


router.post('/login', async (req, res) => {
  const userLogin = req.body;

  try {
    if (!userLogin.email) {
      throw new ReferenceError("Please input email");
    }
    if (!userLogin.password) {
      throw new ReferenceError("Please input password");
    }

    const users = await userCollection;

    // Find user by email
    const user = await users.findOne({ email: userLogin.email });

    if (!user) {
      return res.status(401).send('Invalid credentials'); // no user with that email
    }

    // Compare passwords 
    if (user.password === userLogin.password) {
      return res.status(200).json({ 
        message: `User ${user.givenName} logged in successfully`,
        user: {
          _id: user._id,
          email: user.email,
          givenName: user.givenName,
          familyName: user.familyName,
          role: user.role
        }
      });
    }

    return res.status(401).send('Invalid credentials'); // wrong password
  } 
  catch (err) {
    if (err instanceof ReferenceError) {
      return res.status(400).send(err.message);
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ------------------------------- Router PUTs -------------------------------

// router.put('/:userId', (req,res) => {
//   const id = req.params.userId;                // Sending data with params
//   const userToUpdate = userArray.find(user => user.userId == id);
//   const updatedUser = req.body;                // Sending data with body

//   if (userToUpdate) {
//     for (const key in updatedUser) {
//       userToUpdate[key] = updatedUser[key];
//     }
//     // Save updated user in the users array
//     const index = userArray.findIndex(user => user.userId == id);
//     if (index != -1) {
//       userArray[index] = userToUpdate;
//     }
//     res.status(200).send(`user ${id} updated successfully`);
//   } else {
//     res.status(404).send(`user not found`);
//   }
// });

// ------------------------------- Router DELETEs ----------------------------

// router.delete('/:userId', (req,res) => {
//   const id = req.params.userId;
//   const index = userArray.findIndex(user => user.userId == id);

//   if (index != -1) {
//     userArray.splice(index,1);                 // Start at index, remove one element
//     res.status(200).send(`User ${id} deleted successfully`);
//   } else {
//     res.status(404).send(`User not found`);
//   }
// });

export { router as userRouter }
// export { userArray as userArray }

// ------------------------------- Functions --------------------------------