//|==================================================|
//|---------------------[-IMPORTS-]------------------|
//|==================================================|
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getClient, getDatabase } from "./database.js";
//|==================================================|
//|-----------[-MIDDLEWARE-INITIALIZATION-]----------|
//|==================================================|
const client = await getClient();
const db = await getDatabase();
//|==================================================|
//|-----------------[-BETTER-AUTH-EXPORT-]-----------|
//|==================================================|
export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
    trustedOrigins: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8080",
      "https://lawnconnect-service-294349793000.us-central1.run.app"
    ],
   database: mongodbAdapter(db, {
        client
    }),
     emailAndPassword: { 
        enabled: true, 
    },
     session:{
        cookieCache:true,
        maxAge: 60 * 60 * 1000 // 1 hour
    },
    user: {
        additionalFields: {
            role: {
                type: "object", // MongoDB stores arrays as objects
                required: false,
            },
            profile: {
                type: "object",
                required: false,
            }}}});