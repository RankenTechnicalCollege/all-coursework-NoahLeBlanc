import express from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../database.js';
import debug from 'debug';
import Joi from 'joi';

const router = express.Router();
const debugBug = debug('app:BugRouter');

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

let bugCollection = await getCollection('bugs');
let userCollection = await getCollection('users');

// ==========================================
// [ GET ALL BUGS ]
// ==========================================
router.get('/', async (req, res) => {
  debugBug("GET /api/bugs hit");
  try {
    const bugs = await bugCollection.find({}).toArray();
    res.status(200).json(bugs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bugs' });
  }
});

// ==========================================
// [ GET BUG BY ID ]
// ==========================================
router.get('/:bugId', async (req, res) => {
  const { bugId } = req.params;
  debugBug(`GET /api/bugs/${bugId} hit`);
  try {
    if (!ObjectId.isValid(bugId)) {
      return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
    }

    const bug = await bugCollection.findOne({ _id: new ObjectId(bugId) });
    if (!bug) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }

    res.status(200).json(bug);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// [ POST CREATE BUG ]
// ==========================================
router.post('/', async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    stepsToReproduce: Joi.string().required()
  });

  const validateResult = schema.validate(req.body);
  if (validateResult.error) {
    return res.status(400).json({ error: validateResult.error.message });
  }

  try {
    const newBug = {
      ...req.body,
      closed: false,
      createdOn: new Date(),
      lastUpdated: new Date()
    };

    const result = await bugCollection.insertOne(newBug);
    res.status(201).json({ message: 'Bug created!', bugId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create bug' });
  }
});

// ==========================================
// [ PATCH UPDATE BUG ]
// ==========================================
router.patch('/:bugId', async (req, res) => {
  const { bugId } = req.params;

  if (!ObjectId.isValid(bugId)) {
    return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
  }

  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    stepsToReproduce: Joi.string()
  }).min(1);

  const validateResult = schema.validate(req.body);
  if (validateResult.error) {
    return res.status(400).json({ error: validateResult.error.message });
  }

  try {
    const updateData = { ...req.body, lastUpdated: new Date() };
    const result = await bugCollection.updateOne({ _id: new ObjectId(bugId) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }

    res.status(200).json({ message: `Bug ${bugId} updated.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update bug' });
  }
});

// ==========================================
// [ PATCH CLASSIFY BUG ]
// ==========================================
router.patch('/:bugId/classify', async (req, res) => {
  const { bugId } = req.params;

  if (!ObjectId.isValid(bugId)) {
    return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
  }

  const schema = Joi.object({
    classification: Joi.string().valid('Critical', 'Major', 'Minor', 'Trivial').required()
  });

  const validateResult = schema.validate(req.body);
  if (validateResult.error) {
    return res.status(400).json({ error: validateResult.error.message });
  }

  try {
    const updateData = {
      classification: req.body.classification,
      classifiedOn: new Date(),
      lastUpdated: new Date()
    };

    const result = await bugCollection.updateOne({ _id: new ObjectId(bugId) }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }

    res.status(200).json({ message: `Bug ${bugId} classified.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to classify bug' });
  }
});

// ==========================================
// [ PATCH ASSIGN BUG ]
// ==========================================
router.patch('/:bugId/assign', async (req, res) => {
  const { bugId } = req.params;

  if (!ObjectId.isValid(bugId)) {
    return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
  }

  const schema = Joi.object({
    assignedToUserId: Joi.string().required()
  });

  const validateResult = schema.validate(req.body);
  if (validateResult.error) {
    return res.status(400).json({ error: validateResult.error.message });
  }

  try {
    const userId = req.body.assignedToUserId;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `assignedToUserId ${userId} is not a valid ObjectId.` });
    }

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: `User ${userId} not found.` });
    }

    const updateData = {
      assignedToUserId: user._id,
      assignedToUserName: `${user.givenName} ${user.familyName}`,
      lastUpdated: new Date()
    };

    const result = await bugCollection.updateOne({ _id: new ObjectId(bugId) }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }

    res.status(200).json({ message: `Bug ${bugId} assigned to ${updateData.assignedToUserName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign bug' });
  }
});

// ==========================================
// [ PATCH CLOSE BUG ]
// ==========================================
router.patch('/:bugId/close', async (req, res) => {
  const { bugId } = req.params;

  if (!ObjectId.isValid(bugId)) {
    return res.status(404).json({ error: `bugId ${bugId} is not a valid ObjectId.` });
  }

  const schema = Joi.object({
    closed: Joi.boolean().required()
  });

  const validateResult = schema.validate(req.body);
  if (validateResult.error) {
    return res.status(400).json({ error: validateResult.error.message });
  }

  try {
    const updateData = {
      closed: req.body.closed,
      closedOn: new Date(),
      lastUpdated: new Date()
    };

    const result = await bugCollection.updateOne({ _id: new ObjectId(bugId) }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }

    res.status(200).json({ message: `Bug ${bugId} closed.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to close bug' });
  }
});

export { router as bugRouter };
