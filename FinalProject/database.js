//|====================================================================================================|
//|-------------------------------------------[ INITIALIZATION ]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-------------------[-IMPORTS-]--------------------|
//|==================================================|
import { MongoClient, ObjectId } from "mongodb";
import debug from "debug";
import dotenv from "dotenv";
//|==================================================|
//|----------------[-INSTANTIATION-]-----------------|
//|==================================================|
dotenv.config();
const debugDb = debug("app:Database");
let _db = null;

//|==================================================|
//|-----------[-MONGODB-INITIALIZATION-]-------------|
//|==================================================|
export async function connect() {
  try {
    if (_db) return _db;
    const connectionString = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;
    if (!connectionString) {
      throw new Error("Missing MONGO_URI environment variable");
    };
    if (!dbName) {
      throw new Error("Missing MONGO_DB_NAME environment variable");
    };
    const client = await MongoClient.connect(connectionString);
    _db = client.db(dbName);
    return _db;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  };
};
//|====================================================================================================|
//|-----------------------------------------------[ DATABASE GET ]-------------------------------------|
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
//|--------------[ GET BY OBJECT ]-----------------|
//|================================================|
export async function getByObject(collection, object, item) {
  const db = await connect();
  const foundItem = await db.collection(collection).findOne({ [object]: item });
  return foundItem;
};
//|====================================================================================================|
//|-----------------------------------------------[ DATABASE INSERT ]----------------------------------|
//|====================================================================================================|
//|================================================|
//|------------[ INSERT NEW OBJECT ]---------------| 
//|================================================|
export async function insertNew(collectionName, newObject) {
  const db = await connect();
  const result = await db.collection(collectionName).insertOne(newObject);
  return result;
};
//|====================================================================================================|
//|--------------------------------------------[ DATABASE UPDATE ]-------------------------------------|
//|====================================================================================================|
//|================================================|
//|--------------[ UPDATE USER ]-------------------|
//|================================================|
export async function updateUser(userId, updatedUser) {
  const db = await connect();
  const result = await db.collection('users').updateOne(
    { _id: userId },
    { $set: { ...updatedUser, lastUpdated: new Date()}}
  );
  return result;
};
//|================================================|
//|--------------[ UPDATE BUG ]--------------------|
//|================================================|
export async function updateBug(bugId, updatedBug) {
  const db = await connect();
  const result = await db.collection('bugs').updateOne(
    { _id: bugId},
    { $set: { ...updatedBug, lastUpdated: new Date()}}
  );
  return result;
};
//|====================================================================================================|
//|--------------------------------------------[ DATABASE DELETE ]-------------------------------------|
//|====================================================================================================|
//|================================================|
//|--------------[-DELETE-BY-OBJECT-]--------------|
//|================================================|
export async function deleteByObject(collection, object, item) {
  const db = await connect();
  const deletedItem = await db.collection(collection).deleteOne({ [object]: item });
  return deletedItem;
};
//|====================================================================================================|
//|-------------------------------------------------[ PING ]-------------------------------------------|
//|====================================================================================================|
export async function ping() {
  const db = await connect();
  const pong = await db.command({ ping: 1 });
  debugDb(`ping: ${JSON.stringify(pong)}`);
};
