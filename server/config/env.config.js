import { config } from "dotenv";

config({ path: '.env' });

export const { PORT, MONGO_URI: DB_URI } = process.env;
export const NODE_ENV = process.env.NODE_ENV || 'development';