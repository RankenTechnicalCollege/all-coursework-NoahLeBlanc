//|====================================================================================================|
//|-------------------------------------------[-INITIALIZATION-]---------------------------------------|
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
  const foundData = await db.collection(collectionName).findOne({ [fieldName]: item });
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
//|------------------------------------[-DATABASE-USER-FUNCTIONS-]-------------------------------------|
//|====================================================================================================|
//|================================================|
//|--------------[-UPDATE-USER-]-------------------|
//|================================================|
export async function updateUser(userId, updatedUser) {
  const db = await connect();
  //checks if any updates have been passed
  if (Object.values(updatedUser).length === 0) {
    const err = new Error("No fields provided to update");
    err.status = 400;
    throw err;
  };
  const existingUser = await getByObject('users', "_id", userId);
  if(!existingUser){
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  };
   // Check if any values actually differ
  const isDifferent = Object.entries(updatedUser).some(([key, value]) => {
    return JSON.stringify(existingUser[key]) !== JSON.stringify(value);
  });
  if (!isDifferent) {
    const err = new Error("No changes were made — values are the same");
    err.status = 400;
    throw err;
  };
  //Updates the user 
  const result = await db.collection('users').updateOne(
    { _id: userId },
    { $set: { ...updatedUser, lastUpdated: new Date()}}
  );
  if (result.matchedCount === 0) {
      const err = new Error("User not found");
      err.status = 404; // Not Found
      throw err;
  };
  //if the user isn't modified throws an error
  if (result.modifiedCount === 0) {
    const err = new Error("No changes were made to the user");
    err.status = 400; // Bad Request
    throw err;
  };
  return result;
};
//|====================================================================================================|
//|------------------------------------[-DATABASE-BUGS-FUNCTIONS-]-------------------------------------|
//|====================================================================================================|
//|================================================|
//|--------------[-UPDATE-BUG-]--------------------|
//|================================================|
export async function updateBug(bugId, updatedBug) {
  const db = await connect();
  //checks if any updates have been passed
  if (Object.values(updatedBug).length === 0) {
    const err = new Error("No fields provided to update");
    err.status = 400;
    throw err;
  };
  const existingBug = await getByObject('bugs', "_id", bugId);
  if(!existingBug){
    const err = new Error("Bug not found");
    err.status = 404;
    throw err;
  };
   // Check if any values actually differ
  const isDifferent = Object.entries(updatedBug).some(([key, value]) => {
    return JSON.stringify(existingBug[key]) !== JSON.stringify(value);
  });
  if (!isDifferent) {
    const err = new Error("No changes were made — values are the same");
    err.status = 400;
    throw err;
  };
  //Updates the bug
  const result = await db.collection('bugs').updateOne(
    { _id: bugId},
    { $set: { ...updatedBug, lastUpdated: new Date()}}
  );
  return result;
};
//|================================================|
//|---------[-UPDATE:-ASSIGN-BUG-TO-USER]----------|
//|================================================|
export async function assignBugToUser(userId, bugId) {
  const db = await connect();

  const existingUser = await getByObject('users', '_id', userId);
  if (!existingUser) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  // Make sure bugId is a proper ObjectId
  const bugObjectId = typeof bugId === 'string' ? new ObjectId(bugId) : bugId;

  // Check if the bug is already assigned
  const alreadyAssigned = existingUser.assignedBugs?.some(
    (assignedId) => assignedId.equals(bugObjectId)
  );

  if (alreadyAssigned) {
    const err = new Error("Bug already assigned to user");
    err.status = 400;
    throw err;
  }

  // Add the bug ID to the user's assignedBugs
  const result = await db.collection('users').updateOne(
    { _id: userId },
    {
      $addToSet: { assignedBugs: bugObjectId },
      $set: { lastUpdated: new Date() }
    }
  );

  if (result.modifiedCount === 0) {
    const err = new Error("No changes were made to the user");
    err.status = 400;
    throw err;
  }

  return result;
}
//|====================================================================================================|
//|------------------------------------[-DATABASE-TEST-FUNCTIONS-]-------------------------------------|
//|====================================================================================================|
//|====================================================================================================|
//|---------------------------------------------[-PING-]-----------------------------------------------|
//|====================================================================================================|
export async function ping() {
  const db = await connect();
  const pong = await db.command({ ping: 1 });
  debugDb(`ping: ${JSON.stringify(pong)}`);
};
