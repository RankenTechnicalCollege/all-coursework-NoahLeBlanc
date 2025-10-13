//|==================================================|
//|--------------------[-IMPORTS-]-------------------|
//|==================================================|
import express from 'express';
import debug from 'debug';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

import { listAll, getByObject, deleteUser, updateUser } from '../../database.js'; // Removed getCollection
import { validId } from '../../middleware/validId.js';
import { validBody } from '../../middleware/validBody.js';
import { userSchema, userLoginSchema, userPatchSchema } from '../../middleware/schemas/userSchema.js';

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
    debugUser(`list: Users`);
    const foundData = await listAll('users');

    if (foundData) {
      return res.status(200).json(foundData);
    } else {
      throw new Error('No users found');
    };
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    newUser.password = await bcrypt.hash(newUser.password, saltRounds);

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
  };
});

//|==================================================|
//|------------------[-LOGIN-USER-]------------------|
//|==================================================|
router.post('/login', validBody(userLoginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await require('../../database.js').connect();
    const userCol = db.collection('users');

    const user = await userCol.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
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
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    };

    const db = await require('../../database.js').connect();
    const userCol = db.collection('users');

    const result = await userCol.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `User ${userId} not found.` });
    };

    res.status(200).json({ message: `User ${userId} updated successfully.` });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  };
});

//|==================================================|
//|----------------[-DELETE-USER-BY-ID-]-------------|
//|==================================================|
router.delete('/:userId', validId('userId'), async (req, res) => {
  const { userId } = req.params;

  try {
    const db = await require('../../database.js').connect();
    const userCol = db.collection('users');

    const result = await userCol.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: `User ${ugserId} deleted successfully.` });
    } else {
      res.status(404).json({ message: `User ${userId} not found.` });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  };
});

//|==================================================|
//|----------------[EXPORT-ROUTER]-------------------|
//|==================================================|
export { router as userRouter };