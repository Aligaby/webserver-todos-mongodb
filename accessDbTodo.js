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

// export const myData = [
//   {
//     id: 0,
//     title: "Title 0",
//     description: "Description 0",
//     dueDate: today,
//     isComplete: true,
//   },
// ];

// const uri =
//   "mongodb+srv://y00G1u9pNtGGw82i:y00G1u9pNtGGw82i@cluster0.jxlayxm.mongodb.net/test";
const uri = accessDb.MONGO_URI;
const client = new MongoClient(uri);
// let myData = "";

async function run() {
  try {
    await client.connect();
    const myDatabase = client.db(accessDb.MONGO_DB);
    const myCollections = myDatabase.collection(accessDb.MONGO_COLLECTION);

    const query = { id: 1 };
    const myData = await myCollections.findOne(query);
    console.log(myData);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
