//|====================================================================================================|
//|-------------------------------------------[-INITIALIZATION-]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------------------[-IMPORTS-]------------------|
//|==================================================|
import { bugSchema, bugPatchSchema, bugClassifySchema, bugAssignSchema, bugCloseSchema} from '../../middleware/schema.js';
import { listAll, getByObject, deleteByObject, updateUser, insertNew, updateBug} from '../../database.js'; 
import { validBody } from '../../middleware/validBody.js';
import { validId } from '../../middleware/validId.js';
import { ObjectId } from 'mongodb';
import express from 'express';
import debug from 'debug';
//|==================================================|
//|-----------[-MIDDLEWARE-INITIALIZATION-]----------|
//|==================================================|
const router = express.Router();
const debugBug = debug('app:BugRouter');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//|====================================================================================================|
//|-------------------------------------------[-GET-REQUESTS-]-----------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-----------------[-GET-ALL-BUGS-]-----------------|
//|==================================================|
router.get('/list', async (req, res) => {
  debugBug("GET /api/bugs hit");
  try {
    const bugs = await listAll('bugs');
    res.status(200).json(bugs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bugs' });
  };
});
//|==================================================|
//|-----------------[-GET-BUG-BY-ID-]----------------|
//|==================================================|
router.get('/:bugId', validId('bugId'), async (req, res) => {
  const { bugId } = req.params;
  try {
    const bug = await getByObject('bugs', '_id', bugId) 
    if (!bug) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    };
    res.status(200).json(bug);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  };
});
//|====================================================================================================|
//|-------------------------------------------[-POST-REQUESTS-]----------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-----------------[-POST-CREATE-BUG-]--------------|
//|==================================================|
router.post('/new',validBody(bugSchema), async (req, res) => {
  try {
    const newBug = {
      ...req.body,
      closed: false,
      createdOn: new Date(),
      lastUpdated: new Date()
    };;
    const existingBug = await getByObject('bugs', 'title', newBug.title);
    if (existingBug) {
      return res.status(400).json({ error: 'bug is already registered' });
    };
    const result = await insertNew('bugs', newBug);
    if(!result){
      res.status(500).json({ error: 'Failed to create bug' });
    }
    res.status(201).json({ message: `Bug created! ${newBug.title}`});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  };
});
//|====================================================================================================|
//|-------------------------------------------[-PATCH-REQUESTS-]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-----------------[-PATCH UPDATE BUG-]-------------|
//|==================================================|
router.patch('/:bugId', validId('bugId'), validBody(bugPatchSchema), async (req, res) => {
  try {
    const { bugId } = req.params;
    const updatedBug = req.body;
    await updateBug(bugId, updatedBug)
    res.status(200).json({ message: `Bug ${bugId} updated.` });
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
//|---------------[-PATCH-CLASSIFY-BUG-]-------------|
//|==================================================|
router.patch('/:bugId/classify', validId('bugId'), validBody(bugClassifySchema), async (req, res) => {
  try {
    const { bugId } = req.params;
    const updatedBug = req.params;
    await updateBug(bugId, updatedBug)
    res.status(200).json({ message: `Bug ${bugId} classified.` });
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to classify bug' });
  };
});
//|==================================================|
//|-----------------[-PATCH ASSIGN BUG-]-------------|
//|==================================================|
router.patch('/:bugId/assign', async (req, res) => {
  const { bugId } = req.params;
  if (!ObjectId.isValid(bugId)) {
    return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
  };
  const validateResult = bugAssignSchema.validate(req.body);
  if (validateResult.error) {
    return res.status(400).json({ error: validateResult.error.message });
  };

  try {
    const userId = req.body.assignedToUserId;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `assignedToUserId ${userId} is not a valid ObjectId.` });
    };

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: `User ${userId} not found.` });
    };

    const updateData = {
      assignedToUserId: user._id,
      assignedToUserName: `${user.givenName} ${user.familyName}`,
      lastUpdated: new Date()
    };;

    const result = await bugCollection.updateOne({ _id: new ObjectId(bugId) }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    };

    res.status(200).json({ message: `Bug ${bugId} assigned to ${updateData.assignedToUserName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign bug' });
  };
});

//|==================================================|
//|-----------------[-PATCH CLOSE BUG-]--------------|
//|==================================================|
router.patch('/:bugId/close', async (req, res) => {
  const { bugId } = req.params;

  if (!ObjectId.isValid(bugId)) {
    return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
  };


  const validateResult = bugCloseSchema.validate(req.body);
  if (validateResult.error) {
    return res.status(400).json({ error: validateResult.error.message });
  };

  try {
    const updateData = {
      closed: req.body.closed,
      closedOn: new Date(),
      lastUpdated: new Date()
    };;

    const result = await bugCollection.updateOne({ _id: new ObjectId(bugId) }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    };

    res.status(200).json({ message: `Bug ${bugId} closed.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to close bug' });
  };
});
//|====================================================================================================|
//|-------------------------------------------[ FUNCTIONS ]--------------------------------------------|
//|====================================================================================================|
function autoCatch(err, res){
    console.error(err);
    return res.status(err.status).json({ error: err.message });
}
//|====================================================================================================|
//|-------------------------------------------[ EXPORT ROUTER ]----------------------------------------|
//|====================================================================================================|
export { router as bugRouter };
