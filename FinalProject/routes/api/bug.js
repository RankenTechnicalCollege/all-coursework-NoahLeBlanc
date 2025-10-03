import express from 'express';
import {ObjectId} from 'mongodb';
import debug from 'debug';
import {getCollection} from '../../database.js';


const router = express.Router();
const debugBug = debug('app:bugRouter');
const bugCollection = await getCollection("bugs")

router.use(express.urlencoded({extended:false}));

// ===========================================================================
// [                              ROUTER GET                                 ]
// ===========================================================================

router.get('/list',async  (req,res) => {
    debugBug('list route hit');

    try {
    const bugs = await bugCollection.find({}).toArray(); // <-- convert cursor to array
    res.status(200).json(bugs);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bugs" });
    }
});

router.get("/:bugId", async (req,res) =>{
    debugBug(`ID route hit`)
  try {
    const id = req.params.bugId;
    const bugId = new ObjectId(id);

    if (!bugId) {
      return res.status(400).json({ message: "No bugId provided" });
    }

    // Find bug by ID
    const bug = await bugCollection.findOne({ _id: bugId});

    if (!bug) {
      return res.status(404).json({ message: `Bug ${bugId} not found` });
    }

    // Success
    res.status(200).json(bug);

  } catch (err) {
    if (err.name === "BSONError") {
      return res.status(400).json({ error: "Invalid bug ID format" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ===========================================================================
// [                              ROUTER POST                                ]
// ===========================================================================

//router.post('/new', (req,res) =>{
    ////Req object has a body prop that contains the data sent by client
    //const newBug = req.body;
    //if (!newBug.title) {
        //res.status(400).type('text/plain').send('Title is required');
        //return;
    //}
    //if (!newBug.description) {
        //res.status(400).type('text/plain').send('Description is required');
        //return;
    //}
    //if (!newBug.stepsToReproduce) {
        //res.status(400).type('text/plain').send('Steps to reproduce are required');
        //return;
    //}

    //// check if a bug with the same title already exists
    //const search = bugArray.find(bug => bug.title === newBug.title);
    //if (search !== undefined) {
        //res.status(400).type('text/plain').send('Bug with this title already exists');
        //return;
    //}
    //newBug.userId = nanoid();
    //console.log(newBug)
    //bugArray.push(newBug);
    //res.status(200).json({message: `New Bug '${newBug.title}' Registered!`});
//});

// ===========================================================================
// [                              ROUTER PUT                                 ]
// ===========================================================================

//router.put('/:bugId', (req,res) =>{
    //const id = req.params.bugId; // sending data with params

    //const bugToUpdate = bugArray.find(bug => bug.id == id);

    //const updatedBug = req.body; // sending data with body

    //if (bugToUpdate) {
        //for (const key in updatedBug) {
            //bugToUpdate[key] = updatedBug[key];
        //}

        //// save updated bug in the bugs array
        //const index = bugArray.findIndex(bug => bug.id == id);
        //if (index !== -1) {
            //bugArray[index] = bugToUpdate;
        //}

        //res.status(200).send(`Bug ${id} updated successfully`);
    //} else {
        //res.status(404).send(`Bug not found`);
    //}
//});


//router.put('/:bugId/classify', (req, res) => {
    //const id = req.params.bugId; // param
    //const bugToUpdate = bugArray.find(bug => bug.id == id);

    //if (bugToUpdate) {
        //// set new description from request body
        //bugToUpdate.description = req.body.description;

        //res.status(200).send(`Bug ${id} description updated successfully`);
    //} else {
        //res.status(404).send(`Bug not found`);
    //}
//});

//router.put('/:bugId/assign', (req, res) => {
    //const bugId = req.params.bugId;            // bug ID from URL
    //const { userId } = req.body;               // user ID from request body

    //// find bug
    //const bug = bugArray.find(b => b.id === bugId);
    //if (!bug) {
        //return res.status(404).json({ error: "Bug not found" });
    //}

    //// find user
    //const user = userArray.find(u => u.userId === userId);
    //if (!user) {
        //return res.status(404).json({ error: "User not found" });
    //}

    //// assign bug to user
    //user.assignedBug = bugId;

    //res.status(200).json({
        //message: `Bug ${bugId} assigned to user ${userId}`,
        //user
    //});
//});
//router.put('/:bugId/close', (req,res) =>{
    //const id = req.params.bugId;
    //const index = bugArray.findIndex(bug => bug.bugId == id);

    //if(index != -1){
        //bugArray.splice(index,1);//start at index, remove one element
        //res.status(200).send(`Bug ${id} deleteted succesfully`);
    //}else{
        //res.status(404).send(`Bug not found`)
    //}
//});
export {router as bugRouter}
