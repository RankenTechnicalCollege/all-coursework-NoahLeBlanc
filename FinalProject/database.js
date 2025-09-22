import * as dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";
import debug from 'debug';

const debugDb = debug('app:Database');

// Generate/Parse an ObjectId
const newId = (str) => new ObjectId(str);

// Global variable storing the open connection
let _db = null;

// Connect to the database
async function connect() {
    if (!_db) {
        const dbUrl = process.env.DB_URL;
        const dbName = process.env.DB_NAME;
        const client = await MongoClient.connect(dbUrl, { serverSelectionTimeoutMS: 5000 });
        _db = client.db(dbName);
        debugDb('Connected to MongoDB.');
    }
    return _db;
}

// Connect to the database and verify the connection
async function ping() {
    try {
        const db = await connect();
        await db.command({ ping: 1 });
        debugDb('Ping successful.');
    } catch (err) {
        debugDb('Ping failed:', err);
        throw err;
    }
}

export { connect, ping, newId };
// FIXME: add more functions here​