import express from 'express';
import { newId, getCollection } from '../../database.js';
import debug from 'debug';
import { ObjectId } from 'mongodb';

const router = express.Router();
const debugComments = debug(`app:BugRouter`)

router.use(express.urlencoded ({extended: false}))
router.use(express.json());

let bugCollection = await getCollection('bugs');


// ===========================================
//            [ GET SPECIFIC BUG ALL COMMENTS]
// ==========================================
router.get('/:bugId/comments', async (req, res) => {
  debugComments(`GET /:bugId/comments hit`);
  try {
    // Extract bugId from route params
    const { bugId } = req.params;

    // Validate ID before using it
    if (!ObjectId.isValid(bugId)) {
      return res.status(400).json({ error: `${bugId} is not a valid ObjectId.` });
    }

    // Convert string to ObjectId
    const bugObjectId = newId(bugId);

    // Check if bug exists
    const bugExists = await bugCollection.findOne(
      { _id: bugObjectId },
      { projection: { _id: 1 } }
    );

    if (!bugExists) {
      return res.status(404).json({ error: `Bug ${bugId} not found.` });
    }

    // Fetch comments only
    const bugComments = await bugCollection.findOne(
      { _id: bugObjectId },
      { projection: { comments: 1, _id: 0 } }
    );

    // Check if bug has comments
    if (!bugComments || !bugComments.comments || bugComments.comments.length === 0) {
      return res.status(404).json({ error: `Bug ${bugId} has no comments.` });
    }

    res.status(200).json(bugComments.comments);
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch ${bugId}'s comments.` });
  }
});

// ===========================================
//            [ GET BUGID WITH COMMENT ID]
// ==========================================
router.get('/:bugId/comments/:commentId', async (req, res) => {
  try {
    const { bugId, commentId } = req.params;

    if (!ObjectId.isValid(bugId) || !ObjectId.isValid(commentId)) {
      return res.status(404).json({ error: `The ID's do not have valid ObjectId's.` });
    }

    const bug = await bugCollection
    .findOne({_id: bugId});

    if(!bug){
      return res.status(404).json({ error: `Bug ${bug} not found.` });
    }

    const bugObjectId = newId(bugId);
    const commentObjectId = newId(commentId);

    const comment = await bugCollection
    .findOne({_id: bugObjectId, "comments._id": commentObjectId}, {"comment.$": 1});

    if (!comment) {
      return res.status(404).json({ error: `Comment ${commentObjectId} not found.` });
    }
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// ===========================================
//            [ POST COMMENT ONTO BUGID ]
// ==========================================
router.get('/:bugId/comments', async (req, res) => {})
export {router as commentRouter};