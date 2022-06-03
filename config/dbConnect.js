import dotenv from "dotenv";
dotenv.config();

export const accessDb = {
  MONGO_URI: process.env.DB_MONGO_URI,
  NAME: process.env.DB_NAME,
};
