import dotenv from "dotenv";
dotenv.config();

export const accessDb = {
  MONGO_URI: process.env.DB_MONGO_URI,
  MONGO_DB: process.env.DB_NAME,
  MONGO_COLLECTION: process.env.DB_COLLECTION,
};
