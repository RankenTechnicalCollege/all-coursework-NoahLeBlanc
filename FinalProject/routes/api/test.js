import express from 'express';
import { newId, getCollection } from '../../database.js';
import debug from 'debug';
import { ObjectId } from 'mongodb';

//To Do
// =====================================================================================
//                                       [ GET REQUESTS ] 
// =====================================================================================
// ===========================================
//    [ GET ALL TESTS FOR A SPECIFIC BUG ]
// ===========================================
//GET /api/bugs/:bugId/tests(10pts)
router.get('/:bugId/tests', async (req, res) => {
try{

}
catch(err){

}});
// ===========================================
//  [ GET SPECIFIC TEST FOR A SPECIFIC BUG ]
// ===========================================
//GET /api/bugs/:bugId/tests/:testId(10pts)
router.get('/:bugId/tests/:testId', async (req, res) => {
try{

}
catch(err){

}});
// =====================================================================================
//                                       [ POST REQUESTS ] 
// =====================================================================================
// ===========================================
//   [ CREATE NEW TEST FOR A SPECIFIC BUG]
// ===========================================
//POST /api/bugs/:bugId/tests(10pts)
router.post('/:bugId/tests', async (req, res) => {
try{

}
catch(err){

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

}
catch(err){

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

}
catch(err){

}});

// =======================================[ EXPORT ROUTER ]=============================
export {router as testRouter};