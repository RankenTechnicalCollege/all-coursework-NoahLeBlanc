//|====================================================================================================|
//|-------------------------------------------[ INITIALIZATION ]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------------------[-IMPORTS-]------------------|
//|==================================================|
import express from 'express';
import debug from 'debug';
import { ObjectId } from 'mongodb';
import { commentSchema } from '../../middleware/schema.js';
import { connect } from '../../database.js';
//|==================================================|
//|----------------[-JOI-INITIALIZATION-]------------|
//|==================================================|
const router = express.Router();
const debugComments = debug('app:Comments');
const debugIDValidation = debug('app:IDValidation');

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

//|========================================================================================|
//|---------------------------------------[-GET-REQUESTS-]---------------------------------|
//|========================================================================================|
//|============================================|
//|------[-GET-ALL-COMMENTS-FOR-A-BUG-]--------|
//|============================================|
router.get('/:bugId/comments', async (req, res) => {
  debugComments(`GET /:bugId/comments hit`);
  try {
    const { bugId } = req.params;

    // Validate ID
    validateID(bugId);

    const bugObjectId = new ObjectId(bugId);

    const db = await connect();
    const bugData = await db.collection('bugs').findOne({ _id: bugObjectId });

    if (!bugData) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    };

    if (!bugData.comments || bugData.comments.length === 0) {
      return res.status(404).json({ error: `Bug ${bugId} has no comments.` });
    };

    res.status(200).json(bugData.comments);
  } catch (err) {
    console.error(err);
    res.status(err.message.includes('ObjectId') ? 400 : 500).json({ error: err.message });
  };
});

//|============================================|
//|------[-GET-A-SPECIFIC-COMMENT-BY-ID-]------|
//|============================================|
router.get('/:bugId/comments/:commentId', async (req, res) => {
  debugComments(`GET /:bugId/comments/:commentId hit`);
  try {
    const { bugId, commentId } = req.params;

    // Validate IDs
    validateID(bugId);
    validateID(commentId);

    const bugObjectId = new ObjectId(bugId);
    const commentObjectId = new ObjectId(commentId);

    const db = await connect();
    const bugData = await db.collection('bugs').findOne(
      { _id: bugObjectId, 'comments._id': commentObjectId },
      { projection: { 'comments.$': 1 } }
    );

    if (!bugData || !bugData.comments || bugData.comments.length === 0) {
      return res.status(404).json({ error: `Comment ${commentId} not found.` });
    };

    res.status(200).json(bugData.comments[0]);
  } catch (err) {
    console.error(err);
    res.status(err.message.includes('ObjectId') ? 400 : 500).json({ error: err.message });
  };
});

//|========================================================================================|
//|------------------------------------[-POST-REQUESTS-]-----------------------------------|
//|========================================================================================|
//|============================================|
//|-----[-POST-A-NEW-COMMENT-TO-A-BUG-]--------|
//|============================================|
router.post('/:bugId/comments', async (req, res) => {
  debugComments(`POST /:bugId/comments hit`);
  try {
    const { bugId } = req.params;
    const { author, commentText } = req.body;

    // Validate input with Joi
    const { error } = commentSchema.validate({ author, commentText });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    };

    // Validate bug ID
    validateID(bugId);
    const bugObjectId = new ObjectId(bugId);

    const db = await connect();

    // Check if bug exists
    const bugExists = await db.collection('bugs').findOne({ _id: bugObjectId });
    if (!bugExists) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    };

    // Create new comment object
    const newComment = {
      _id: new ObjectId(),
      author,
      commentText,
      createdAt: new Date()
    };

    // Add comment to bug
    await db.collection('bugs').updateOne(
      { _id: bugObjectId },
      { $push: { comments: newComment } }
    );

    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(err.message.includes('ObjectId') ? 400 : 500).json({ error: err.message });
  }
});

//|====================================================================================================|
//|-------------------------------------------[-FUNCTIONS-]--------------------------------------------|
//|====================================================================================================|
//|==========================================|
//|-------[-ID-Validation-Function-]---------|
//|==========================================|
function validateID(i) {
  if (!ObjectId.isValid(i)) {
    const err = new Error(`${i} is not a valid ObjectId.`);
    err.status = 400;
    throw err;
  };
  debugIDValidation(`${i} Passed ID validation`);
};

//|====================================================================================================|
//|-------------------------------------------[-EXPORT-ROUTER-]----------------------------------------|
//|====================================================================================================|
export { router as commentRouter };