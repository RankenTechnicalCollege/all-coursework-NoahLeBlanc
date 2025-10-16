//|====================================================================================================|
//|-------------------------------------------[-INITIALIZATION-]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-------------------[-IMPORTS-]--------------------|
//|==================================================|
import { MongoClient, } from "mongodb";
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
//|------------------------------------[-DATABASE-MULTI-USE-FUNCTIONS-]--------------------------------|
//|====================================================================================================|
//|================================================|
//|-----------[-GET-ALL-FROM-COLLECTION-]----------|
//|================================================|
export async function listAll(collectionName) {
  const db = await connect();
  const foundData = await db.collection(collectionName).find().toArray();
  return foundData;
};
//|================================================|
//|--------------[-GET-BY-OBJECT-]-----------------|
//|================================================|
export async function getByObject(collectionName, fieldName, fieldValue) {
  const db = await connect();
  const foundData = await db.collection(collectionName).findOne({ [fieldName]: fieldValue});
  if(!foundData){
    const err = new Error(`${fieldValue} not found.`);
    err.status = 400;
    throw err;
  }
  return foundData;
};
//|================================================|
//|------------[-INSERT-NEW-OBJECT-]---------------|-
//|================================================|
export async function insertNew(collectionName, newFieldValue) {
  const db = await connect();
  const result = await db.collection(collectionName).insertOne(newFieldValue);
  return result;
};
//|================================================|
//|--------------[-DELETE-BY-OBJECT-]--------------|
//|================================================|
export async function deleteByObject(collectionName, fieldName, fieldValue) {
  const db = await connect();
  const deletedItem = await db.collection(collectionName).deleteOne({ [fieldName]: fieldValue });
  return deletedItem;
};
//|====================================================================================================|
//|---------------------------------------------[-PING-]-----------------------------------------------|
//|====================================================================================================|
export async function ping() {
  const db = await connect();
  const pong = await db.command({ ping: 1 });
}