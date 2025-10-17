//|==================================================|
//|--------------------[-IMPORTS-]-------------------|
//|==================================================|
import { listAll, getByObject, deleteByObject, updateUser, insertNew} from '../../database.js'; 
import { userSchema, userLoginSchema, userPatchSchema } from '../../middleware/schema.js';
import { genPassword, comparePassword } from '../../middleware/bcrypt.js';
import { validId, validBody } from '../../middleware/validation.js';
import express from 'express';
import debug from 'debug';
//|==================================================|
//|-----------[-MIDDLEWARE-INITIALIZATION-]----------|
//|==================================================|
const router = express.Router();
const debugUser = debug('app:UserRouter');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

//|==================================================|
//|----------------[-LIST-ALL-USERS-]----------------|
//|==================================================|
router.get('/list', async (req, res) => {
  try {
    const foundData = await listAll('users');
    debugUser(`list: Users`);
    return res.status(200).json(foundData);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json({ error: 'Failed to update bug' });
    }
  };
});

//|==================================================|
//|----------------[-GET-USER-BY-ID-]----------------|
//|==================================================|
router.get('/:userId', validId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    const foundUser = await getByObject('users', '_id', userId);
    if (!foundUser) {
      return res.status(404).json({ message: `User ID: ${userId} not found` });
    };
    return res.status(200).json(foundUser);
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
    const existingUser = await getByObject('users', 'email', newUser.email)  
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    };

    newUser.password = await genPassword(newUser.password);

    newUser.creationDate = new Date() 
    const status = await insertNew('users', newUser) 
    if(!status.acknowledged){
      return res.status(500).json({ error: 'Failed to create new user. Please try again later.' });
    }
    res.status(201).json({ message: `New User ${newUser.givenName + " " + newUser.familyName} Registered!` });
  } catch (err) {
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
  try {
    const { userId } = req.params;
    const updates = req.body;
    if (updates.password) {
      updates.password = await genPassword(updates.password);
    };
    await updateUser(userId, updates)
    res.status(200).json({ message: `User ${userId} updated successfully.` });
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json({ error: 'Failed to update bug' });
    }
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
//|====================================================================================================|
//|-------------------------------------------[ FUNCTIONS ]--------------------------------------------|
//|====================================================================================================|
function autoCatch(err, res){
    console.error(err);
    return res.status(err.status).json({ error: err.message });
};
//|==================================================|
//|----------------[EXPORT-ROUTER]-------------------|
//|==================================================|
export { router as userRouter };