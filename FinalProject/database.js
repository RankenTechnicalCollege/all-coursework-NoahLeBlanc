import { MongoClient } from "mongodb";
import debug from "debug";

//Bcrypt Stuff
import bcrypt from 'bcrypt'
const saltRounds = 10;
bcrypt.genSalt(saltRounds, (err, salt) => {
if (err) {
    // Handle error
    return;
}});

//---------------------------------------------- Main ------------------------------------------------
// Logs database status
const debugDb = debug("app:Database");

/** Global variable storing the open connection, do not use it directly. *​*/
let _db = null;


//-------------------------------------------- Connection --------------------------------------------
async function connectToDatabase() {
  if (!_db) {
    const connectionString = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;

    const client = await MongoClient.connect(connectionString);
    _db = client.db(dbName);
  }
  return _db;
}

//------------------------------------------ Functions ------------------------------------------
//Generate/Parse an ObjectId 
const newId = (str) => ObjectId.createFromHexString(str);

async function ping() {
  const db = await connectToDatabase();
  const pong = await db.command({ ping: 1 });
  debugDb(`ping: ${JSON.stringify(pong)}`);
}
export async function getCollection(collectionName) {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}
export async function hash(userPassword){
    bcrypt.hash(userPassword, salt, (err, hash) => {
    if (err) {
        return;
    
      }
    return hash;
  })};

//--------------------------------------------- Exports ----------------------------------------------
export { ping, connectToDatabase};
