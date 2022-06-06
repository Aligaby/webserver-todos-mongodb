import { MongoClient } from "mongodb";
import { accessDb } from "./config/dbConnect.js";

const uri = accessDb.MONGO_URI;
const client = new MongoClient(uri);

export const collections = {};

export async function run() {
  try {
    await client.connect();
    const myDatabase = client.db(accessDb.MONGO_DB);
    const todoCollection = myDatabase.collection(accessDb.MONGO_COLLECTION);

    collections.myData = todoCollection;
  } catch (err) {
    throw new Error(`Database connection error => ${err}`);
  }
}

run().catch(console.dir);
