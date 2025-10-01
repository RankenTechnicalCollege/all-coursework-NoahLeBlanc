import { MongoClient } from "mongodb";
import debug from "debug";

//---------------------------------------------- Main ------------------------------------------------
// Logs database status
const debugDb = debug("app:Database");

// Database instance holder
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

//------------------------------------------ User Functions ------------------------------------------
async function ping() {
  const db = await connectToDatabase();
  const pong = await db.command({ ping: 1 });
  debugDb(`ping: ${JSON.stringify(pong)}`);
}

//--------------------------------------------- Exports ----------------------------------------------
export { ping, connectToDatabase };
