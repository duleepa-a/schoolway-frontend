'use server'
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';


console.log(":sads");

if (!process.env.DB_URL) {
  throw new Error("DB_URL is not defined in environment variables");
}

// const sql = neon(process.env.DATABASE_URL);
const sql = neon(process.env.DB_URL as string);
console.log('Database URL:', process.env.DB_URL);


export { sql };