//|====================================================================================================|
//|-------------------------------------------[ INITIALIZATION ]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------------------[-IMPORTS-]------------------|
//|==================================================|
import express from 'express';
import debug from 'debug';
import { ObjectId } from 'mongodb';
import {testSchema, testPatchSchema } from '../../middleware/schema.js';
import { connect } from '../../database.js';
//|==================================================|
//|----------------[-JOI-INITIALIZATION-]--------------|
//|==================================================|

const router = express.Router();
const debugTests = debug('app:TestAPI');

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

//|========================================================================================|
//|---------------------------------------[ GET REQUESTS ]---------------------------------|
//|========================================================================================|

//|============================================|
//|------[ GET ALL TEST CASES FOR A BUG ]-----|
//|============================================|
router.get('/:bugId/tests', async (req, res) => {
  debugTests(`GET /:bugId/tests hit`);
  try {
    const { bugId } = req.params;

    // Validate ID
    validateID(bugId);

    const bugObjectId = new ObjectId(bugId);
    const db = await connect();
    const bugData = await db.collection('bugs').findOne({ _id: bugObjectId });

    if (!bugData) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }

    if (!bugData.testCases || bugData.testCases.length === 0) {
      return res.status(404).json({ error: `Bug ${bugId} has no test cases.` });
    }

    res.status(200).json(bugData.testCases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//|============================================|
//|------[ GET SPECIFIC TEST CASE FOR A BUG ]|
//|============================================|
router.get('/:bugId/tests/:testId', async (req, res) => {
  debugTests(`GET /:bugId/tests/:testId hit`);
  try {
    const { bugId, testId } = req.params;

    // Validate IDs
    validateID(bugId);
    validateID(testId);

    const bugObjectId = new ObjectId(bugId);
    const testObjectId = new ObjectId(testId);

    const db = await connect();
    const bugData = await db.collection('bugs').findOne({ _id: bugObjectId });

    if (!bugData || !bugData.testCases) {
      return res.status(404).json({ error: `Test case ${testId} not found for bug ${bugId}` });
    }

    const testCase = bugData.testCases.find(tc => tc?.testCase?._id?.equals(testObjectId));

    if (!testCase) {
      return res.status(404).json({ error: `Test case ${testId} not found for bug ${bugId}` });
    }

    res.status(200).json(testCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//|========================================================================================|
//|------------------------------------[ POST REQUESTS ]-----------------------------------|
//|========================================================================================|

//|============================================|
//|---[ CREATE A NEW TEST CASE FOR A BUG ]-----|
//|============================================|
router.post('/:bugId/tests', async (req, res) => {
  debugTests(`POST /:bugId/tests hit`);
  try {
    const { bugId } = req.params;
    const testData = req.body;

    // Validate bug ID
    validateID(bugId);
    const bugObjectId = new ObjectId(bugId);

    // Validate test case data
    const { error } = testSchema.validate(testData);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Create new test case object
    const newTestCase = {
      _id: new ObjectId(),
      ...testData
    };

    const db = await connect();
    const result = await db.collection('bugs').updateOne(
      { _id: bugObjectId },
      { $push: { testCases: newTestCase } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: `Bug ${bugId} not found or test case not added.` });
    }

    debugTests(`Test case added to bug ${bugId}`);
    res.status(201).json({ message: 'Test case added successfully', testCase: newTestCase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//|========================================================================================|
//|---------------------------------------[ PATCH REQUESTS ]--------------------------------|
//|========================================================================================|

//|============================================|
//|--[ UPDATE A TEST CASE FOR A BUG ]----------|
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
    }

    // Prepare update object
    const updateQuery = {};
    for (const key in updates) {
      updateQuery[`testCases.$.testCase.${key}`] = updates[key];
    }

    const db = await connect();
    const result = await db.collection('bugs').updateOne(
      { _id: bugObjectId, 'testCases.testCase._id': testObjectId },
      { $set: updateQuery }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `Test case ${testId} not found for bug ${bugId}` });
    }

    debugTests(`Test case ${testId} updated for bug ${bugId}`);
    res.status(200).json({ message: 'Test case updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//|====================================================================================================|
//|-----------------------------------------[ DELETE TEST CASES ]-----------------------------------|
//|====================================================================================================|

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
    }

    debugComments(`Test case ${testId} deleted from bug ${bugId}`);
    res.status(200).json({ message: 'Test case deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
//|====================================================================================================|
//|-------------------------------------------[ FUNCTIONS ]----------------------------------------|
//|====================================================================================================|

// Validation function for ObjectId
function validateID(id) {
  if (!ObjectId.isValid(id)) {
    const err = new Error(`${id} is not a valid ObjectId.`);
    err.status = 400;
    throw err;
  }
  debugTests(`${id} Passed ID validation`);
}

// Export the router
export { router as testRouter };