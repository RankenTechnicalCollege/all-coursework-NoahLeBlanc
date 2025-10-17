//|====================================================================================================|
//|-------------------------------------------[-INITIALIZATION-]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------------------[-IMPORTS-]------------------|
//|==================================================|
import {testSchema, testPatchSchema } from '../../middleware/schema.js';
import { validId, validBody } from '../../middleware/validation.js';
import { getByField, insertNew} from '../../database.js';
import express from 'express';
import debug from 'debug';
//|==================================================|
//|----------------[-JOI-INITIALIZATION-]------------|
//|==================================================|
const router = express.Router();
const debugTests = debug('app:TestAPI');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//|========================================================================================|
//|---------------------------------------[-GET-REQUESTS-]---------------------------------|
//|========================================================================================|
//|============================================|
//|------[-GET-ALL-TEST-CASES-FOR-A-BUG-]------|
//|============================================|
router.get('/:bugId/tests', validId('bugId'), async (req, res) => {
  debugTests(`GET /:bugId/tests hit`);
  try {
    const { bugId } = req.params;
    const bugData = await getByField('bugs', '_id', bugId) 
    if (!bugData.testCases || bugData.testCases.length === 0) {
      return res.status(404).json({ error: `Bug ${bugId} has no test cases.` });
    };
    res.status(200).json(bugData.testCases);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }else{
      console.error(err);
      res.status(500).json({ error: 'Failed to GET comments' });
    };
  };
});
//|============================================|
//|-----[-GET-SPECIFIC-TEST-CASE-FOR-A-BUG-]---|
//|============================================|
router.get('/:bugId/tests/:testId', validId('bugId'), validId('testId'), async (req, res) => {
  try {
    const { bugId, testId } = req.params;
    const bugData = await getByField('bugs', '_id', bugId) 
    if (!bugData || !bugData.testCases) {
      return res.status(404).json({ error: `Test case ${testId} not found for bug ${bugId}` });
    };
    const testCase = bugData.testCases.find(tc => tc?.testCase?._id?.equals(testObjectId));
    if (!testCase) {
      return res.status(404).json({ error: `Test case ${testId} not found for bug ${bugId}` });
    };
    res.status(200).json(testCase);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }else{
      console.error(err);
      res.status(500).json({ error: 'Failed to GET comments' });
    };
  };
});
//|========================================================================================|
//|------------------------------------[-POST-REQUESTS-]-----------------------------------|
//|========================================================================================|
//|============================================|
//|---[-CREATE-A-NEW-TEST-CASE-FOR-A-BUG-]-----|
//|============================================|
router.post('/:bugId/tests', validId("bugId"), validBody(testSchema), async (req, res) => {
  debugTests(`POST /:bugId/tests hit`);
  try {
    const { bugId } = req.params;
    const testData = req.body;
    await insertNew()
    debugTests(`Test case added to bug ${bugId}`);
    return res.status(201).json({ message: 'Test case added successfully', testCase: newTestCase });
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }else{
      console.error(err);
      res.status(500).json({ error: 'Failed to GET comments' });
    };
  };
});
//|========================================================================================|
//|---------------------------------------[-PATCH-REQUESTS-]-------------------------------|
//|========================================================================================|
//|============================================|
//|------[-UPDATE-A-TEST-CASE-FOR-A-BUG-]------|
//|============================================|
router.patch('/:bugId/tests/:testId', async (req, res) => {
  debugTests(`PATCH /:bugId/tests/:testId hit`);
  try {
    const { bugId, testId } = req.params;
    const updates = req.body;

    // Validate IDs
    validateID(bugId);
    validateID(testId);

    const bugObjectId = new ObjectId(bugId);
    const testObjectId = new ObjectId(testId);

    // Validate update data
    const { error } = testPatchSchema.validate(updates);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    };

    // Prepare update object
    const updateQuery = {};
    for (const key in updates) {
      updateQuery[`testCases.$.testCase.${key}`] = updates[key];
    };

    const db = await connect();
    const result = await db.collection('bugs').updateOne(
      { _id: bugObjectId, 'testCases.testCase._id': testObjectId },
      { $set: updateQuery }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `Test case ${testId} not found for bug ${bugId}` });
    };

    debugTests(`Test case ${testId} updated for bug ${bugId}`);
    res.status(200).json({ message: 'Test case updated successfully' });
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }else{
      console.error(err);
      res.status(500).json({ error: 'Failed to GET comments' });
    };
  };
});
//|============================================|
//|--[ DELETE A TEST CASE FROM A BUG ]---------|
//|============================================|
router.delete('/:bugId/tests/:testId', async (req, res) => {
  debugComments(`DELETE /:bugId/tests/:testId hit`);
  try {
    const { bugId, testId } = req.params;

    // Validate IDs
    validateID(bugId);
    validateID(testId);

    const bugObjectId = new ObjectId(bugId);
    const testObjectId = new ObjectId(testId);

    const db = await connect();
    const result = await db.collection('bugs').updateOne(
      { _id: bugObjectId },
      { $pull: { testCases: { 'testCase._id': testObjectId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: `Test case ${testId} not found or not deleted.` });
    };

    debugComments(`Test case ${testId} deleted from bug ${bugId}`);
    res.status(200).json({ message: 'Test case deleted successfully' });
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }else{
      console.error(err);
      res.status(500).json({ error: 'Failed to GET comments' });
    };
  };
});
//|====================================================================================================|
//|-------------------------------------------[-FUNCTIONS-]--------------------------------------------|
//|====================================================================================================|
function autoCatch(err, res){ validId('bugId')
    console.error(err);
    res.status(err.status).json({ error: err.message });
};
//|====================================================================================================|
//|-------------------------------------------[-EXPORT-ROUTER-]----------------------------------------|
//|====================================================================================================|
export { router as testRouter };