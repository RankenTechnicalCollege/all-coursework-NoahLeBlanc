//|====================================================================================================|
//|-------------------------------------------[ INITIALIZATION ]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------------------[-IMPORTS-]------------------|
//|==================================================|
import express from 'express';
import { newId, getCollection } from '../../database.js';
import debug from 'debug';
import { ObjectId } from 'mongodb';
import Joi from 'joi';
//|==================================================|
//|----------------[-JOI-INITIALIZATION-]------------|
//|==================================================|
const schema = Joi.object({
    description: Joi.string().required(),
    preconditions: Joi.string().required(),
    steps: Joi.string().required(),
    expectedResult: Joi.string().required(),
    actualResult: Joi.string().required()
});

const router = express.Router();
const debugComments = debug('app:BugRouter');
const debugTests = debug('app:TestDebug');

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

let bugCollection = await getCollection('bugs');
//|========================================================================================|
//|---------------------------------------[ GET REQUESTS ]---------------------------------|
//|========================================================================================|
//|============================================|
//|------[ GET SPECIFIC BUG ALL COMMENTS]------|
//|============================================|
router.get('/:bugId/comments', async (req, res) => {
  debugComments(`GET /:bugId/comments hit`);
  try {
    const { bugId } = req.params;

    // Validate ID
    validateID(bugId);

    // Convert string to ObjectId
    const bugObjectId = new ObjectId(bugId);

    // Fetch bug with comments only
    const bugData = await bugCollection.findOne(
      { _id: bugObjectId },
      { projection: { comments: 1 } }
    );

    if (!bugData) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }

    if (!bugData.comments || bugData.comments.length === 0) {
      return res.status(404).json({ error: `Bug ${bugId} has no comments.` });
    }

    res.status(200).json(bugData.comments);

  } catch (err) {
    console.error(err);
    res.status(err.message.includes('ObjectId') ? 400 : 500).json({ error: err.message });
  }
});

//|============================================|
//|--------[ GET BUGID WITH COMMENT ID]--------|
//|============================================|
router.get('/:bugId/comments/:commentId', async (req, res) => {
  debugComments(`GET /:bugId/comments/:commentId hit`);

  try {
    const { bugId, commentId } = req.params;

    // Validate both IDs
    validateID(bugId);
    validateID(commentId);

    const bugObjectId = new ObjectId(bugId);
    const commentObjectId = new ObjectId(commentId);

    // Fetch comment
    const comment = await bugCollection.findOne(
      { _id: bugObjectId, 'comments._id': commentObjectId },
      { projection: { 'comments.$': 1 } }
    );

    if (!comment || !comment.comments || comment.comments.length === 0) {
      return res.status(404).json({ error: `Comment ${commentId} not found.` });
    }

    res.status(200).json(comment.comments[0]);

  } catch (err) {
    console.error(err);
    res.status(err.message.includes('ObjectId') ? 400 : 500).json({ error: err.message });
  }
});
//|========================================================================================|
//|------------------------------------[ POST REQUESTS ]-----------------------------------|
//|========================================================================================|
//|============================================|
//|-----------[ POST COMMENT ONTO BUGID ]------|
//|============================================|
router.post('/:bugId/comments', async (req, res) => {
  debugComments(`POST /:bugId/comments hit`);

  try {
    const { bugId } = req.params;
    const { commentText, author } = req.body;

    // Validate bug ID
    validateID(bugId);

    const bugObjectId = new ObjectId(bugId);

    // Check if bug exists
    const bugExists = await bugCollection.findOne(
      { _id: bugObjectId },
      { projection: { _id: 1 } }
    );

    if (!bugExists) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }

    // Insert comment
    const newComment = {
      _id: new ObjectId(),
      text: commentText,
      author: author || 'Anonymous',
      createdAt: new Date()
    };

    await bugCollection.updateOne(
      { _id: bugObjectId },
      { $push: { comments: newComment } }
    );

    res.status(201).json({ message: 'Comment added', comment: newComment });

  } catch (err) {
    console.error(err);
    res.status(err.message.includes('ObjectId') ? 400 : 500).json({ error: err.message });
  }
});
//|========================================================================================|
//|---------------------------------------[ FUNCTIONS ]------------------------------------|
//|========================================================================================|
//|=============================================|
//|----------[ VALIDATOR FUNCTION ]-------------|
//|=============================================|
function validateID(i) {
  if (!ObjectId.isValid(i)) {
    const err =  new Error(`${i} is not a valid ObjectId.`);
    err.status = 400;
    throw err;
  }
  debugTests(`${i} Passed ID validation`);
}
//|====================================================================================================|
//|-------------------------------------------[ EXPORT ROUTER ]----------------------------------------|
//|====================================================================================================|
export { router as commentRouter };