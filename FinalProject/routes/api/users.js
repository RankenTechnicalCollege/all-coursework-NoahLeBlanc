//|====================================================================================================|
//|-------------------------------------------[ INITIALIZATION ]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|--------------------[-IMPORTS-]-------------------|
//|==================================================|
import express from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../database.js';
import Joi from 'joi';
//|==================================================|
//|---------------[-JOI-INITIALIZATION-]-------------|
//|==================================================|
const patchSchema = Joi.object({
  password: Joi.string().min(3).optional(),
  fullName: Joi.string().min(1).optional(),
  givenName: Joi.string().min(1).optional(),
  familyName: Joi.string().min(1).optional(),
  role: Joi.string().valid('Admin', 'Developer', 'Tester', 'Project Manager').optional()
}).min(1);
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required()
});
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
  givenName: Joi.string().min(1).required(),
  familyName: Joi.string().min(1).required(),
  role: Joi.string().valid(
    'Admin',
    'Developer',
    'Tester',
    'Project Manager'
  ).required()
});
//|==================================================|
//|-----------[-MIDDLEWARE-INITIALIZATION-]----------|
//|==================================================|
const router = express.Router();
import debug from 'debug';
const debugUser = debug('app:UserRouter');
router.use(express.urlencoded({ extended: false }));
let userCollection = await getCollection("users");
//|==================================================|
//|----------------[-BCRYPT-INITIALIZATION-]---------|
//|==================================================|
import bcrypt from 'bcrypt';
const saltRounds = 10;
bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) return;
});
//|====================================================================================================|
//|-------------------------------------------[-GET-REQUESTS-]-----------------------------------------|
//|====================================================================================================|
//|==================================================|
//|----------------[-LIST-ALL-USERS-]----------------|
//|==================================================|
router.get('/list', async (req, res) => {
  debugUser("list route hit");
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
    /*|===================|*/
    /*|------[-OUTPUT-]---|*/
    /*|===================|*/
    res.status(200).json(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
//|==================================================|
//|----------------[-GET-USER-BY-ID-]----------------|
//|==================================================|
router.get('/:userId', async (req, res) => {
  debugUser("ID route hit");
  const { userId } = req.params;
  try {
    if (!ObjectId.isValid(userId)) {
      return res.status(404).json({ error: `userId ${userId} is not a valid ObjectId.` });
    }
    const id = new ObjectId(userId);
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
      return res.status(404).json({ error: `User ${userId} not found.` });
    }
    /*|===================|*/
    /*|------[-OUTPUT-]---|*/
    /*|===================|*/
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//|====================================================================================================|
//|-------------------------------------------[-POST-REQUESTS-]----------------------------------------|
//|====================================================================================================|
//|==================================================|
//|----------------[-REGISTER-NEW-USERS-]------------|
//|==================================================|
router.post('/register', async (req, res) => {
  debugUser("Register Hit");
  try {
    const newUser = req.body;
    const { error } = userSchema.validate(newUser);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existingUser = await userCollection.findOne({ email: newUser.email });
    if (existingUser) return res.status(400).json({ error: 'Email is already registered' });

    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = hashedPassword;

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    newUser.creationDate = `${mm}/${dd}/${yyyy}`;

    await userCollection.insertOne(newUser);
    res.status(201).json({ message: `New User ${newUser.givenName} Registered!` });
  } catch (err) {
    debugUser(err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const userLogin = req.body;
  try {
    const { error } = loginSchema.validate(userLogin);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await userCollection.findOne({ email: userLogin.email });
    if (!user) return res.status(401).json('Invalid credentials');

    const isMatch = await bcrypt.compare(userLogin.password, user.password);
    if (isMatch) return res.json(user);

    return res.status(401).json('Invalid credentials');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//|====================================================================================================|
//|-------------------------------------------[-PATCH-REQUESTS-]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|----------------[-UPDATE-USER-BY-ID-]-------------|
//|==================================================|
router.patch('/:userId', async (req, res) => {
  debugUser("PATCH userId hit");
  const { userId } = req.params;
  const updates = req.body;

  try {
    if (!ObjectId.isValid(userId)) {
      return res.status(404).json({ error: `userId ${userId} is not a valid ObjectId.` });
    }

    const { error } = patchSchema.validate(updates);
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const objectId = new ObjectId(userId);
    const result = await userCollection.updateOne(
      { _id: objectId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `User ${userId} not found.` });
    }
    /*|===================|*/
    /*|------[-OUTPUT-]---|*/
    /*|===================|*/
    res.status(200).json({ message: `User ${userId} updated successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//|====================================================================================================|
//|-------------------------------------------[-DELETE-REQUESTS-]--------------------------------------|
//|====================================================================================================|
//|==================================================|
//|----------------[-DELETE-USER-BY-ID-]-------------|
//|==================================================|
router.delete('/:userId', async (req, res) => {
  debugUser("DELETE userId hit");
  const { userId } = req.params;
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(404).json({ error: `userId ${userId} is not a valid ObjectId.` });
    }

    const objectId = new ObjectId(userId);
    const user = await userCollection.findOne({ _id: objectId });

    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found.` });
    }

    const result = await userCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      /*|===================|*/
      /*|------[-OUTPUT-]---|*/
      /*|===================|*/
      res.status(200).json({ message: `User ${userId} deleted successfully.` });
    } else {
      res.status(500).json({ message: 'Failed to delete user.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
//|====================================================================================================|
//|-------------------------------------------[ EXPORT ROUTER ]----------------------------------------|
//|====================================================================================================|
export { router as userRouter };
