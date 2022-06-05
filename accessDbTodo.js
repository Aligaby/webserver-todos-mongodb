/**
 *
 * interoghez baza de date
 * si cu promisiuni
 * ofer rezultatul in todoController
 * care vor fi preluate in reponse.end cu JSON(rezultat)
 *
 */

import { MongoClient } from "mongodb";
import { accessDb } from "./dbConnect.js";

const date = new Date();
const [month, day, year] = [
  date.getMonth() + 1,
  date.getDate() + 2,
  date.getFullYear(),
];
export const today = `${day}.${month}.${year}`;

const uri = accessDb.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const myDatabase = client.db(accessDb.MONGO_DB);
    const myCollections = myDatabase.collection(accessDb.MONGO_COLLECTION);

    const query = { id: 1 };
    const myData = await myCollections.findOne(query);
    console.log(myData);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
