import express from 'express';
import { ObjectId } from 'mongodb'; // Converts text id's to object _id's like in mongo
import { getCollection } from '../../database.js';

const router = express.Router();

import debug from 'debug';
const debugUser = debug('app:UserRouter');

router.use(express.urlencoded({ extended: false }));
let userCollection = await getCollection("users");

import bcrypt from 'bcrypt';
const saltRounds = 10;

bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) {
    // Handle error
    return;
  }
});

// ===========================================================================
// [                               ROUTER GETS                               ]
// ===========================================================================
router.get('/list', async (req, res) => {
  debugUser("list route hit")
  try {
    const allUsers = await userCollection.find(
      {},
      {
        projection: {
          _id: 1,
          email: 1,
          familyName: 1,
          givenName: 1,
          createdBugs: 1,
          assignedBugs: 1,
          role: 1
        }
      }
    ).toArray();

    res.status(200).json(allUsers);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get("/:userId", async (req, res) => {
  debugUser("ID route hit")
  try {
    const id = new ObjectId(req.params.userId);
    const user = await userCollection.findOne(
      { _id: id },
      {
        projection: {
          _id: 0,
          email: 1,
          familyName: 1,
          givenName: 1,
          createdBugs: 1,
          assignedBugs: 1
        }
      }
    );

    if (!user) {
      throw new Error(`User ${id} Not found`);
    }

    res.status(200).json(user);

  } catch (err) {
    if (err.name === "BSONError") {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    res.status(404).json({ error: err.message });
  }
});

// ===========================================================================
// [                              ROUTER POSTS                               ]
// ===========================================================================
router.post('/register', async (req, res) => {
  debugUser("Register Hit")
  const newUser = req.body;

  // Validation
  if (!newUser.email) return res.status(400).json('email is required');
  if (!newUser.password) return res.status(400).json('password is required');
  if (!newUser.givenName) return res.status(400).json('Given Name is required');
  if (!newUser.familyName) return res.status(400).json('Family Name is required');
  if (!newUser.role) return res.status(400).json('role is required');

  const search = await userCollection.findOne({ email: newUser.email });

  if (search) {
    return res.status(400).json('Email already registered');
  }

  try {
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = hashedPassword;

    // Format new date as mm/dd/yyyy
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();

    newUser.creationDate = `${mm}/${dd}/${yyyy}`;

    await userCollection.insertOne(newUser);

    res.status(201).json({ message: `New User ${newUser.givenName} Registered!` });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json("Internal Server Error");
  }
});

router.post('/login', async (req, res) => {
  const userLogin = req.body;
  try {
    if (!userLogin.email) throw new ReferenceError("Please input email");
    if (!userLogin.password) throw new ReferenceError("Please input password");

    const user = await userCollection.findOne({ email: userLogin.email });

    if (!user) {
      return res.status(401).json('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(userLogin.password, user.password);

    if (isMatch) {
      return res.json(user);
    }

    return res.status(401).json('Invalid credentials');
  } catch (err) {
    if (err instanceof ReferenceError) {
      return res.status(400).json(err.message);
    }
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ===========================================================================
// [                               ROUTER PUTS                               ]
// ===========================================================================
router.put('/:userId', async (req, res) => {
  debugUser("Put ID hit")
  try {
    const id = req.params.userId;
    const objectId = new ObjectId(id);
    const updatedInfo = req.body;

    if (!updatedInfo || Object.keys(updatedInfo).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const user = await userCollection.findOne({ _id: objectId });
    if (!user) {
      return res.status(404).json({ message: `User ${id} not found` });
    }

    const result = await userCollection.updateOne(
      { _id: objectId },
      { $set: updatedInfo }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: `No changes were made` });
    }

    res.status(200).json({ message: `User ${id} updated successfully` });

  } catch (err) {
    if (err.name === "BSONError") {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
});

// ===========================================================================
// [                              ROUTER DELETE                              ]
// ===========================================================================
router.delete('/:userId', async (req, res) => {
  debugUser("DELETE userId hit")
  try {
    const id = req.params.userId;
    const objectId = new ObjectId(id);

    const user = await userCollection.findOne({ _id: objectId });

    if (!user) {
      return res.status(404).json({ message: `User ${id} not found` });
    }

    const result = await userCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: `User ${id} deleted successfully` });
    } else {
      res.status(500).json({ message: "Failed to delete user" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export { router as userRouter };
