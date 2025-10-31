//|====================================================================================================|
//|-------------------------------------------[-INITIALIZATION-]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|--------------------[-IMPORTS-]-------------------|
//|==================================================|
import { listAll, getByField, deleteByObject, insertNew} from '../../middleware/database.js'; 
import { userSchema, userPatchSchema} from '../../middleware/schema.js';
import { validId, validBody } from '../../middleware/validation.js';
import express from 'express';
import debug from 'debug';
import { attachSession } from '../../middleware/authentication.js';
//|==================================================|
//|-----------[-MIDDLEWARE-INITIALIZATION-]----------|
//|==================================================|
const router = express.Router();
const debugUser= debug('app:userRoute');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//|====================================================================================================|
//|--------------------------------------[-USER GET FUNCTION-]-----------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-----------------[-GET /API/USERS-]---------------|
//|==================================================|
router.get('/users', async (req, res) => {
  try {
    const foundData = await listAll('user');
    if (foundData) {
      return res.status(200).json([foundData]);
    } else {
      throw new Error('No users found');
    };
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to GET users' }]);
    }
  };
});
//|==================================================|
//|------------[-GET /API/USERS/:USERID-]------------|
//|==================================================|
router.get('/users/:userId', validId('userId'), async (req, res) => {
  try {
    const { userId } = req.params;
    const foundData = await getByField('user', '_id', userId);
    if (!foundData) {
      return res.status(404).json([{ message: `user ID: ${userId} not found` }]);
    };
    return res.status(200).json([foundData]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to GET users' }]);
    }
  };
});
//|==================================================|
//|---------------[-GET /API/USERS/ME]---------------|
//|==================================================|
router.get('/user/me', attachSession, async (req, res) => {
  try {
    const foundData = await getByField('user', '_id', validId(req.user._id));
    return res.status(200).json([foundData]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to GET users' }]);
    }
  };
});
//|====================================================================================================|
//|--------------------------------------[-user POST FUNCTION-]-------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-------------[-POST /api/users-]---------------|
//|==================================================|
router.post('/', validBody(userSchema), async (req, res) => {
  try {
    const newuser = req.body;

    newuser.createdOn = new Date() 
    const status = await insertNew('users', newuser) 
    if(!status.acknowledged){
      return res.status(500).json([{ error: 'Failed to create new user. Please try again later.' }]);
    }
    res.status(201).json([{ message: `New user ${newuser._id} Added!` }]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to add a user' }]);
    }
  };
});
//|====================================================================================================|
//|--------------------------------------[-user PATCH FUNCTION-]------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------[-PATCH /api/users/:userId-]-------|
//|==================================================|
router.patch('/:userId', validId('userId'), validBody(userPatchSchema), async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    await updateuser(userId, updates)
    res.status(200).json([{ message: `user ${userId} updated successfully.` }]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to add a user' }]);
    }
  };
});
//|====================================================================================================|
//|--------------------------------------[-user DELETE FUNCTION-]-----------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------[-DELETE /api/users/:userId-]------|
//|==================================================|
router.delete('/:userId', validId('userId'), async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await deleteByObject("users", '_id', userId)
    if (result.deletedCount === 1) {
      res.status(200).json([{ message: `user ${userId} deleted successfully.` }]);
    } else {
      res.status(404).json([{ message: `user ${userId} not found.` }]);
    }
  } catch (err) {
    res.status(500).json([{ message: 'Server error' }]);
    console.error(err)
  };
});
//|====================================================================================================|
//|-------------------------------------------[ FUNCTIONS ]--------------------------------------------|
//|====================================================================================================|
function autoCatch(err, res){
    console.error(err);
    return res.status(err.status).json([{ error: err.message }]);
};
//|==================================================|
//|----------------[EXPORT-ROUTER]-------------------|
//|==================================================|
export {router as userRouter};