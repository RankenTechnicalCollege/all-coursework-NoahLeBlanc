import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./auth.js";
import dotenv from "dotenv";
import cors from 'cors';
//------------------Routes------------------------//
import { ping } from "./middleware/database.js";
import { productRouter } from "./routes/api/product.js";

dotenv.config();

//-------------------------------------------- Config ---------------------------------------------
const port = process.env.PORT || 5000;
const app = express();
app.use(cors(
  {
    origin: [
      "http://localhost:5000",
      "http://localhost:5050",
      "http://localhost:3000",
      "http://localhost:8080"],
    credentials: true
  }));
//--------------------------------------------Middleware-------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.static("frontend/dist"));
app.use(express.json());
//---------------------------------------------Route-----------------------------------------------
app.use("/api/products", productRouter);
//--------------------------------------------Database---------------------------------------------
ping();
//---------------------------------------------auth-----------------------------------------------
// Add better-auth handler - this handles all auth endpoints including cookies
//Login: POST /api/auth/sign-in/email
//Registration: POST /api/auth/sign-up/email
//Get Session: GET /api/auth/get-session
//Logout: POST /api/auth/sign-out
app.all("/api/auth/*splat", toNodeHandler(auth));
//------------------------------------------ Start Server -----------------------------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
