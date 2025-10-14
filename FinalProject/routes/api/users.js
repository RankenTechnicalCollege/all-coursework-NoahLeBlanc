//|==================================================|
//|--------------------[-IMPORTS-]-------------------|
//|==================================================|
import express from 'express';
import debug from 'debug';
import { genPassword, comparePassword } from '../../middleware/bcrypt.js';
import { ObjectId } from 'mongodb';

import { listAll, getByObject, deleteByObject, updateUser} from '../../database.js'; // Removed getCollection
import { validId } from '../../middleware/validId.js';
import { validBody } from '../../middleware/validBody.js';
import { userSchema, userLoginSchema, userPatchSchema } from '../../middleware/schema.js';

//|==================================================|
//|-----------[-MIDDLEWARE-INITIALIZATION-]----------|
//|==================================================|
const router = express.Router();
const debugUser = debug('app:UserRouter');
const saltRounds = 10;

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// Helper function to get the users collection
async function getUsersCollection() {
  const db = await require('../../database.js').connect();
  return db.collection('users');
};

//|==================================================|
//|----------------[-LIST-ALL-USERS-]----------------|
//|==================================================|
router.get('/list', async (req, res) => {
  try {
    const foundData = await listAll('users');
    if (foundData) {
      return res.status(200).json(foundData);
    } else {
      throw new Error('No users found');
    };
  } catch (err) {
    debugUser(`list: Users`);
    res.status(500).json({ message: err.message });
    console.error(err)
  };
});

//|==================================================|
//|----------------[-GET-USER-BY-ID-]----------------|
//|==================================================|
router.get('/:userId', validId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    const foundUser = await getByObject('users', '_id', new ObjectId(userId));

    if (foundUser) {
      return res.status(200).json(foundUser);
    } else {
      return res.status(404).json({ message: `User ID: ${userId} not found` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err)
  }
});

//|==================================================|
//|----------------[-REGISTER-USER-]-----------------|
//|==================================================|
router.post('/register', validBody(userSchema), async (req, res) => {
  try {
    const newUser = req.body;

    const db = await require('../../database.js').connect();
    const userCol = db.collection('users');

    const existingUser = await userCol.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    };

    newUser.password = await genPassword(newUser.password);

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    newUser.creationDate = `${mm}/${dd}/${yyyy}`;
await userCol.insertOne(newUser);
    res.status(201).json({ message: `New User ${newUser.givenName} Registered!` });
  } catch (err) {
    debugUser(err.message);
    res.status(500).json({ message: err.message });
    console.error(err)
  };
});

//|==================================================|
//|------------------[-LOGIN-USER-]------------------|
//|==================================================|
router.post('/login', validBody(userLoginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getByObject("users", "email", email)
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    comparePassword(password, user.password);

    res.status(200).json({message: `Welcome back! ${user._id}`})

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
    console.error(err)
  };
});

//|==================================================|
//|----------------[-PATCH-USER-BY-ID-]--------------|
//|==================================================|
router.patch('/:userId', validId('userId'), validBody(userPatchSchema), async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    if (updates.password) {
      updates.password = await genPassword(updates.password);
    };

    const result = await updateUser(userId, updates)

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `User ${userId} not found.` });
    };

    res.status(200).json({ message: `User ${userId} updated successfully.` });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
    console.error(err)
  };
});

//|==================================================|
//|----------------[-DELETE-USER-BY-ID-]-------------|
//|==================================================|
router.delete('/:userId', validId('userId'), async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await deleteByObject("users", '_id', userId)
    if (result.deletedCount === 1) {
      res.status(200).json({ message: `User ${userId} deleted successfully.` });
    } else {
      res.status(404).json({ message: `User ${userId} not found.` });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.error(err)
  };
});

//|==================================================|
//|----------------[EXPORT-ROUTER]-------------------|
//|==================================================|
export { router as userRouter };