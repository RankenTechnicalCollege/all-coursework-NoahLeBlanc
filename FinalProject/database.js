//|====================================================================================================|
//|-------------------------------------------[ INITIALIZATION ]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|--------------------[-IMPORTS-]-------------------|
//|==================================================|
import { MongoClient, ObjectId } from "mongodb";
import debug from "debug";
import dotenv from "dotenv";

// Load environment variables (for local dev)
dotenv.config();

const debugDb = debug("app:Database");
let _db = null;

//|==================================================|
//|-----------[-MONGODB-INITIALIZATION-]--------------|
//|==================================================|
export async function connect() {
  if (_db) return _db;

  const connectionString = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME;

  if (!connectionString) {
    throw new Error("Missing MONGO_URI environment variable");
  }
  if (!dbName) {
    throw new Error("Missing MONGO_DB_NAME environment variable");
  }

  try {
    const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    _db = client.db(dbName);
    return _db;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

//|====================================================================================================|
//|-----------------------------------------------[ FUNCTIONS ]----------------------------------------|
//|====================================================================================================|
//|================================================|
//|-----------[ GET ALL FROM COLLECTION ]----------|
//|================================================|
export async function listAll(collection) {
  const db = await connect();
  const foundData = await db.collection(collection).find().toArray();
  return foundData;
};

//|================================================|
//|------------[ INSERT NEW OBJECT ]---------------|
//|================================================|
export async function insertNew(newObject, collection) {
  const db = await connect();
  const result = await db.collection(collection).insertOne(newObject);
  return result;
};

//|================================================|
//|--------------[ UPDATE USER ]-------------------|
//|================================================|
export async function updateUser(userId, updatedUser) {
  const db = await connect();
  const result = await db.collection('users').updateOne(
    { _id: newId(userId) },
    { $set: { ...updatedUser, lastUpdated: new Date() } }
  );
  return result;
}

//|================================================|
//|--------------[ DELETE USER ]-------------------|
//|================================================|
export async function deleteUser(userId) {
  const db = await connect();
  const result = await db.collection('users').deleteOne({ _id: newId(userId) });
  return result;
}

//|================================================|
//|--------------[ GET BY OBJECT ]------------------|
//|================================================|
export async function getByObject(collection, object, item) {
  const db = await connect();
  const foundItem = await db.collection(collection).findOne({ [object]: item });
  return foundItem;
}

//|================================================|
//|--------------[ PING ]--------------------------|
//|================================================|
export async function ping() {
  const db = await connect();
  const pong = await db.command({ ping: 1 });
  debugDb(`ping: ${JSON.stringify(pong)}`);
}

//|================================================|
//|------------[ CONVERT STRING TO OBJECT ID ]-----|
//|================================================|
export function newId(str) {
  return new ObjectId(str);
};