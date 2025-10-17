//|====================================================================================================|
//|-------------------------------------------[ INITIALIZATION ]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------------------[-IMPORTS-]------------------|
//|==================================================|
import { validId, validBody } from '../../middleware/validation.js';
import {getByObject, insertNewComment} from '../../database.js'; 
import { commentSchema } from '../../middleware/schema.js';
import express from 'express';
import debug from 'debug';
//|==================================================|
//|-------------[-MIDDLEWARE-INITIALIZATION-]--------|
//|==================================================|
const router = express.Router();
const debugComments = debug('app:Comments');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//|========================================================================================|
//|---------------------------------------[-GET-REQUESTS-]---------------------------------|
//|========================================================================================|
//|============================================|
//|------[-GET-ALL-COMMENTS-FOR-A-BUG-]--------|
//|============================================|
router.get('/:bugId/comments', validId('bugId'), async (req, res) => {
  try {
    debugComments(`GET /:bugId/comments hit`);
    const { bugId } = req.params;
    const bugData = await getByObject('bugs', '_id', bugId)
    if (!bugData.comments || bugData.comments.length === 0) {
      return res.status(404).json({ error: `Bug ${bugId} has no comments.` });
    };
    res.status(200).json(bugData.comments);
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
//|------[-GET-A-SPECIFIC-COMMENT-BY-ID-]------|
//|============================================|
router.get('/:bugId/comments/:commentId', validId('bugId'), validId('commentId'), async (req, res) => {
  debugComments(`GET /:bugId/comments/:commentId hit`);
  try {
    const { bugId, commentId } = req.params;
    const bugData = await getByObject('bugs', '_id', bugId)
    if (!bugData || !bugData.comments || bugData.comments.length === 0) {
      return res.status(404).json({ error: `Bug has no comments` });
    };
    const foundComment = bugData.comments.find(comment => comment._id.equals(commentId));
    if (!foundComment) {
      return res.status(404).json({ error: `Comment ${commentId} not found.` });
    };
    res.status(200).json(foundComment);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }else{
      console.error(err);
      res.status(500).json({ error: 'Failed to update bug' });
    };
  };
});

//|========================================================================================|
//|------------------------------------[-POST-REQUESTS-]-----------------------------------|
//|========================================================================================|
//|============================================|
//|-----[-POST-A-NEW-COMMENT-TO-A-BUG-]--------|
//|============================================|
router.post('/:bugId/comments', validId('bugId'), validBody(commentSchema), async (req, res) => {
  debugComments(`POST /:bugId/comments hit`);
  try {
    const { bugId } = req.params;
    const newComment = req.body;
    // Add comment to bug
    await insertNewComment(bugId, newComment) 
    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }else{
      console.error(err);
      res.status(500).json({ error: 'Failed to update bug' });
    };
  };
});

//|====================================================================================================|
//|-------------------------------------------[-FUNCTIONS-]--------------------------------------------|
//|====================================================================================================|
//|==========================================|
//|-------[-ID-Validation-Function-]---------|
//|==========================================|
function autoCatch(err, res){ validId('bugId')
    console.error(err);
    res.status(err.status).json({ error: err.message });
};
//|====================================================================================================|
//|-------------------------------------------[-EXPORT-ROUTER-]----------------------------------------|
//|====================================================================================================|
export { router as commentRouter };