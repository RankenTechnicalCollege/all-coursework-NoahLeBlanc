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
let _client = null;
const now = new Date()
const db = await connect();
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
//|--------------[-GET-BY-FIELD-]------------------|
//|================================================|
export async function getByField(collectionName, fieldName, fieldValue) {
  let query;

  if (Array.isArray(fieldValue)) {
    // If array, use $in to match any value in the array
    query = { [fieldName]: { $in: fieldValue } };
  } else {
    // Single value (old behavior)
    query = { [fieldName]: fieldValue };
  }

  const foundData = Array.isArray(fieldValue)
    ? await db.collection(collectionName).find(query).toArray() // return all matches
    : await db.collection(collectionName).findOne(query);        // return single match

  if (!foundData || (Array.isArray(fieldValue) && foundData.length === 0)) {
    const err = new Error(`${fieldValue} not found.`);
    err.status = 404;
    throw err;
  }

  return foundData;
}

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
}
//|================================================|
//|-----------------[-UPDATE-USER-]----------------|
//|================================================|
export async function updateUser(userId, updatedUser) {
  const db = await connect();
  //checks if any updates have been passed
  if (Object.values(updatedUser).length === 0) {
    const err = new Error("No fields provided to update");
    err.status = 400;
    throw err;
  };
  const isDifferent = Object.entries(updatedUser).some(([key, value]) => {
    return JSON.stringify(existingProduct[key]) !== JSON.stringify(value);
  });
  if (!isDifferent) {
    const err = new Error("No changes were made — values are the same");
    err.status = 400;
    throw err;
  };
  //Updates the product 
  const result = await db.collection('products').updateOne(
    { _id: userId},
    { $set: { ...updatedUser, lastUpdatedOn: new Date()}}
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
};;
//|==================================================|
//|------------------[-GET-CLIENT-]------------------|
//|==================================================|
export async function getClient(){
  if(!_client){
    await connect();
  }
  return _client
};
//|==================================================|
//|------------------[-GET-DATABASE-]----------------|
//|==================================================|
export async function getDatabase(){
  return await connect();
};
//|====================================================================================================|
//|---------------------------------------------[-PING-]-----------------------------------------------|
//|====================================================================================================|
export async function ping() {
  const db = await connect();
  const pong = await db.command({ ping: 1 });
  debugDb(`ping: ${JSON.stringify(pong)}`);
};
