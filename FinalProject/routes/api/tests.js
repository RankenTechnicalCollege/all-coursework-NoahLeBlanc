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
//|==================================================|
//|-----------[-MIDDLEWARE-INITIALIZATION-]----------|
//|==================================================|
const router = express.Router();
const debugTests = debug(`app:TestRouter`)
router.use(express.urlencoded ({extended: false}))
router.use(express.json());
let bugCollection = await getCollection('bugs');
//|====================================================================================================|
//|-------------------------------------------[-GET-REQUESTS-]-----------------------------------------|
//|====================================================================================================|
//|==================================================|
//|--------[-GET-ALL-TESTS-FOR-A-SPECIFIC-BUG-]------|
//|==================================================|
router.get('/:bugId/tests', async (req, res) => {
    try {
        const { bugId } = req.params;

        validateID(bugId);

        const bugObjectId = new ObjectId(bugId);
        const bugData = await getBugData(bugCollection, bugObjectId);

        if (!bugData.testCases || bugData.testCases.length === 0) {
            const err = new Error(`Bug ${bugObjectId} has no test cases`);
            err.status = 404;
            throw err;
        }
        debugTests(`Fetching tests for bugId`);
        res.status(200).json(bugData.testCases);
    } 
    catch(err){
        autoCatch(err, res);
    }
});
//|==================================================|
//|-------[ GET SPECIFIC TEST FOR A SPECIFIC BUG ]---|
//|==================================================|
router.get('/:bugId/tests/:testId', async (req, res) => {
    try {
        const { bugId, testId } = req.params;
        validateID(bugId);
        validateID(testId);

        const bugObjectId = new ObjectId(bugId);
        const testCaseObjectId = new ObjectId(testId);
        const bugData = await getBugData(bugCollection, bugObjectId);

        if (!bugData.testCases || bugData.testCases.length === 0) {
            const err = new Error(`Bug ${bugId} has no test cases`);
            err.status = 404;
            throw err;
        }

        const matchingTestCase = bugData.testCases.find(tc =>
            tc?.testCase?._id?.equals(testCaseObjectId)
        );

        if (!matchingTestCase) {
            const err = new Error(`Test case ${testId} not found for bug ${bugId}`);
            err.status = 404;
            throw err;
        }
        debugTests(`Fetching test case ${testCaseObjectId} for bug ${bugObjectId}`);
        res.status(200).json(matchingTestCase);
    }catch (err) {
        autoCatch(err, res)
    }});

//|====================================================================================================|
//|-------------------------------------------[ POST REQUESTS ]----------------------------------------|
//|====================================================================================================|
//|================================================|
//|------[ CREATE NEW TEST FOR A SPECIFIC BUG]-----|
//|================================================|
router.post('/:bugId/tests', async (req, res) => {
    try{
        const {bugId} = req.params;
        const {description, preconditions, steps, expectedResult, actualResult} = req.body;
        validateID(bugId);validateID(testId);
        const bugObjectId = new ObjectId(bugId) 
        const bugData = await getBugData(bugCollection, bugObjectId);

    }
    catch(err){
        autoCatch(err, res);
    }});
//|====================================================================================================|
//|-------------------------------------------[ PATCH REQUESTS ]---------------------------------------|
//|====================================================================================================|
//|================================================|
//|----[ UPDATE SPECIFIC TEST FOR A SPECIFIC BUG ]-|
//|================================================|
router.patch('/:bugId/tests/:testId', async (req, res) => {
    try{
        debugTests(`updating test to bugId`);
        const {bugId, testId} = req.params;
        const {description, preconditions, steps, expectedResult, actualResult} = req.body;
        validateID(bugId);validateID(testId);
        const bugData = await getBugTestCases(bugCollection, bugObjectId);
        
        

    }
    catch(err){
        autoCatch(err, res);
    }});
//|====================================================================================================|
//|-----------------------------------------[ DELETE REQUESTS ]----------------------------------------|
//|====================================================================================================|
//|================================================|
//|--[-DELETE SPECIFIC TEST FOR A SPECIFIC BUG-]---|
//|================================================|
router.delete('/:bugId/tests/:testId', async (req, res) => {
    try{
        debugTests(`delete testID on bugId`);
        const {bugId, testId} = req.params;
        validateID(bugId);validateID(testId);
        const bugData = await getBugTestCases(bugCollection, bugObjectId);

    }
    catch(err){
        autoCatch(err, res);
    }});
//|====================================================================================================|
//|-----------------------------------------------[ FUNCTIONS ]----------------------------------------|
//|====================================================================================================|
//|================================================|
//|--------------[ VALIDATOR FUNCTION ]------------|
//|================================================|
function validateID(i) {
  if (!ObjectId.isValid(i)) {
    const err =  new Error(`${i} is not a valid ObjectId.`);
    err.status = 400;
    throw err;
  }
  debugTests(`${i} Passed ID validation`);
}

//|================================================|
//|---------------[ CATCH FUNCTION ]---------------|
//|================================================|
function autoCatch(err, res) {
    if(err.status){
        return res.status(err.status).json({error : err.message})
    }
    return res.status(500).json({ error: 'Server error' });
}
//|================================================|
//|---------------[ GET BUG DATA ]-----------------|
//|================================================|
async function getBugData(bugCollection, bugObjectId) {
    const data = await bugCollection.findOne({ _id: bugObjectId });
    if (!data) {
        const err = new Error(`Bug with ID ${bugObjectId} not found`);
        err.status = 404;
        throw err;
    }
    return data;
}
//|====================================================================================================|
//|-------------------------------------------[ EXPORT ROUTER ]----------------------------------------|
//|====================================================================================================|
export {router as testRouter};