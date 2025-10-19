//|==================================================|
//|--------------------[-IMPORTS-]-------------------|
//|==================================================|
import { listAll, getByField, deleteByObject, updateUser, insertNew} from '../../database.js'; 
import { userSchema, userLoginSchema, userPatchSchema, userListQuerySchema } from '../../middleware/schema.js';
import { genPassword, comparePassword } from '../../middleware/bcryptFunctions.js';
import { validId, validBody, validQuery } from '../../middleware/validation.js';
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
router.get('/list', validQuery(userListQuerySchema), async (req, res) => {
  try {
    const query = req.query;
    const foundData = await listAll('users', query);
    debugUser(`Success: (GET/list: users)`);
    return res.status(200).json([foundData]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      return res.status(500).json({ error: 'Failed to list users' });
    }
  };
});
//|==================================================|
//|----------------[-GET-USER-BY-ID-]----------------|
//|==================================================|
router.get('/:userId', validId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    const foundUser = await getByField('users', '_id', userId);
    debugUser(`Success: (GET/:userId: ${userId})`);
    return res.status(200).json([foundUser]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      return res.status(500).json({ error: 'Failed to update bug' });
    }
  };
});
//|==================================================|
//|----------------[-REGISTER-USER-]-----------------|
//|==================================================|
router.post('/register', validBody(userSchema), async (req, res) => {
  try {
    const newUser = req.body;
    const existingUser = await getByField('users', 'email', newUser.email)  
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    };
    newUser.password = await genPassword(newUser.password);
    newUser.creationDate = new Date() 
    await insertNew('users', newUser) 
    debugUser(`Success: (POST/register: ${newUser.givenName})`);
    return res.status(201).json([{ message: `New User ${newUser.givenName + " " + newUser.familyName} Registered!` }]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      return res.status(500).json({ error: 'Failed to update bug' });
    }
  };
});
//|==================================================|
//|------------------[-LOGIN-USER-]------------------|
//|==================================================|
router.post('/login', validBody(userLoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getByField("users", "email", email)
    comparePassword(password, user.password);
    debugUser(`Success: (POST/login: ${user._id})`);
    return res.status(200).json([{message: `Welcome back! ${user._id}`}])
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      return res.status(500).json({ error: 'Failed to update bug' });
    }
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
    debugUser(`Success: (PATCH/:userId ${user._id})`);
    return res.status(200).json([{ message: `User ${userId} updated successfully.` }]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      return res.status(500).json({ error: 'Failed to update bug' });
    }
  };
});
//|==================================================|
//|----------------[-DELETE-USER-BY-ID-]-------------|
//|==================================================|
router.delete('/:userId', validId('userId'), async (req, res) => {
  try {
    const {userId} = req.params;
    const result = await deleteByObject("users", '_id', userId)
    if (!result.deletedCount) {
      return res.status(404).json({ message: `User ${userId} not found.` });
    };
    debugUser(`Success: (DELETE/:userId ${user._id})`);
    return res.status(200).json([{ message: `User ${userId} deleted successfully.` }]);
    }catch (err) {
      if(err.status){
        autoCatch(err, res)
      }
      else{
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete User' });
      }
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