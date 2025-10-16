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
  const foundData = await db.collection(collectionName).findOne({ name: newFieldValue.name});
  if(foundData){
    const err = new Error(`${newFieldValue.name} already exists.`);
    err.status = 400;
    throw err;
  }
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
//|================================================|
//|--------------[-UPDATE-PRODUCT-]----------------|
//|================================================|
export async function updateProduct(productId, updatedProduct) {
  const db = await connect();
  //checks if any updates have been passed
  if (Object.values(updatedProduct).length === 0) {
    const err = new Error("No fields provided to update");
    err.status = 400;
    throw err;
  };
  const existingProduct = await getByObject('products', "_id", productId);
  if(!existingProduct){
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  };
   // Check if any values actually differ
  const isDifferent = Object.entries(updatedProduct).some(([key, value]) => {
    return JSON.stringify(existingProduct[key]) !== JSON.stringify(value);
  });
  if (!isDifferent) {
    const err = new Error("No changes were made — values are the same");
    err.status = 400;
    throw err;
  };
  //Updates the product 
  const result = await db.collection('products').updateOne(
    { _id: productId},
    { $set: { ...updatedProduct, lastUpdatedOn: new Date()}}
  );
  if (result.matchedCount === 0) {
      const err = new Error("Product not found");
      err.status = 404; // Not Found
      throw err;
  };
  //if the product isn't modified throws an error
  if (result.modifiedCount === 0) {
    const err = new Error("No changes were made to the product");
    err.status = 400; // Bad Request
    throw err;
  };
  return result;
};

//|====================================================================================================|
//|---------------------------------------------[-PING-]-----------------------------------------------|
//|====================================================================================================|
export async function ping() {
  const db = await connect();
  const pong = await db.command({ ping: 1 });
  debugDb(`ping: ${JSON.stringify(pong)}`);
};
