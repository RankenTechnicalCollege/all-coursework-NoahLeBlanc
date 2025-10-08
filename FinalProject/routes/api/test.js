import express from 'express';
import { newId, getCollection } from '../../database.js';
import debug from 'debug';
import { ObjectId } from 'mongodb';

const router = express.Router();
const debugTests = debug(`app:BugRouter`)

router.use(express.urlencoded ({extended: false}))
router.use(express.json());

let bugCollection = await getCollection('bugs');

// =====================================================================================
//                                       [ GET REQUESTS ] 
// =====================================================================================
// ===========================================
//    [ GET ALL TESTS FOR A SPECIFIC BUG ]   |
// ===========================================
//GET /api/bugs/:bugId/tests(10pts)
router.get('/:bugId/tests', async (req, res) => {
    try{
        debugTests(`DEBUG TEST: fetching tests for bugId`);
        const { bugId } = req.params;
        // Validate ID before using it
        validateID(bugId);
        debugTests('Made it past');
    }
    catch(err){
        console.error(err);
        if(err.status){
            res.status(err.status).json({error: err.message})
        }
        else{
            res.status(500).json({ error: 'Server error' });
        }
    }});
// ===========================================
//  [ GET SPECIFIC TEST FOR A SPECIFIC BUG ] |
// ===========================================
//GET /api/bugs/:bugId/tests/:testId(10pts)
router.get('/:bugId/tests/:testId', async (req, res) => {
    try{
        debugTests(`DEBUG TEST: fetching specific test for bugId`);
        const {bugId, testId} = req.params;
        validateID(bugId);validateID(testId);

    }
    catch(err){
        console.error(err);
        if(err.status){
            res.status(err.status).json({error: err.message})
        }
        else{
            res.status(500).json({ error: 'Server error' });
        }
    }});
// =====================================================================================
//                                       [ POST REQUESTS ] 
// =====================================================================================
// ===========================================
//   [ CREATE NEW TEST FOR A SPECIFIC BUG]   |
// ===========================================
//POST /api/bugs/:bugId/tests(10pts)
router.post('/:bugId/tests', async (req, res) => {
    try{
        debugTests(`DEBUG TEST: adding test to bugId`);
        const {bugId, testId} = req.params;
        validateID(bugId);validateID(testId);

    }
    catch(err){
        console.error(err);
        if(err.status){
            res.status(err.status).json({error: err.message})
        }
        else{
            res.status(500).json({ error: 'Server error' });
        }
    }});
// =====================================================================================
//                                       [ PATCH REQUESTS ] 
// =====================================================================================
// ===========================================
// [ UPDATE SPECIFIC TEST FOR A SPECIFIC BUG ]
// ===========================================
//PATCH /api/bugs/:bugId/tests/:testId
router.patch('/:bugId/tests/:testId', async (req, res) => {
    try{
        debugTests(`DEBUG TEST: updating test to bugId`);
        const {bugId, testId} = req.params;
        validateID(bugId);validateID(testId);

    }
    catch(err){
        console.error(err);
        if(err.status){
            res.status(err.status).json({error: err.message})
        }
        else{
            res.status(500).json({ error: 'Server error' });
        }
    }});
// =====================================================================================
//                                       [ DELETE REQUESTS ] 
// =====================================================================================
// ===========================================
// [ DELETE SPECIFIC TEST FOR A SPECIFIC BUG ]
// ===========================================
//DELETE /api/bugs/:bugId/tests/:testId
router.delete('/:bugId/tests/:testId', async (req, res) => {
    try{
        debugTests(`DEBUG TEST: delete testID on bugId`);
        const {bugId, testId} = req.params;
        validateID(bugId);validateID(testId);

    }
    catch(err){
        console.error(err);
        if(err.status){
            res.status(err.status).json({error: err.message})
        }
        else{
            res.status(500).json({ error: 'Server error' });
        }
    }});
// =====================================================================================
//                                       [ FUNCTIONS ] 
// =====================================================================================
// ===========================================
//            [ VALIDATOR FUNCTION ]         |
// ===========================================
function validateID(i) {
  if (!ObjectId.isValid(i)) {
    const err =  new Error(`${i} is not a valid ObjectId.`);
    err.status == 400;
    throw err;
  }
  debugTests(`${i} Passed ID validation`);
}

// =======================================[ EXPORT ROUTER ]=============================
export {router as testRouter};