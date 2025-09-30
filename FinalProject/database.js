import { MongoClient } from "mongodb"
import debug from "debug"
const debugDb = debug("app:Database");

let _db = null;

//Handles connection to the database
async function connectToDatabase() {
   if (!_db){
    const connectionString = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;
        
    const client = await MongoClient.connect(connectionString)
    _db = client.db(dbName);
   }
   return _db;
}

//-----------------------------------------------------User Functions-------------------------------------------
async function getUsers(){
    const db = await connectToDatabase();
    return db.collection("users").find({}).toArray();
}
    
async function searchUsers(field, value) {
  const db = await connectToDatabase();
  return await db.collection("users").findOne({ [field]: value });
}

async function addUsers(user){
    const db = await connectToDatabase();
    const result = await db.collection("users").insertOne(user);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    return result;
}

//Function calls connect to db and if it works it puts it in the debug
async function ping(){
    const db = await connectToDatabase();
    const pong = await db.command({ping:1});
    debugDb(`ping: ${JSON.stringify(pong)}`);
}
export {ping, getUsers, addUsers, searchUsers};