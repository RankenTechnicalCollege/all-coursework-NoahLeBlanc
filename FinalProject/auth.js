import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getClient, getDatabase } from "./database.js";

const client = await getClient();
const db = await getDatabase();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",
  trustedOrigins: ["http://localhost:5000","http://localhost:5050", "http://localhost:3000", "http://localhost:8080"],
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  session:{
    cookieCache: true,
    maxAge: 60 * 60,
  },
  user:{
    additionalFields:{
      role:{
        type: "object", 
        required: false
      },
      profile:{
        type: "object", 
        required: false
      }
    }
  }
});
