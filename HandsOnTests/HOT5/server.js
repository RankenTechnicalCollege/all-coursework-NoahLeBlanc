import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./auth.js";
import dotenv from "dotenv";
import cors from "cors";
//------------------Routes------------------------//
import { productRouter } from "./routes/api/product.js";
import { userRouter } from "./routes/api/users.js";
import { ping } from "./middleware/database.js";

dotenv.config();

//-------------------------------------------- Config ---------------------------------------------
const port = process.env.PORT || 2023;
const app = express();

//-------------------------------------------- CORS -----------------------------------------------
const corsOptions = {
  origin: [
    "http://localhost:5173", // ✅ Vite
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5050",
    "http://localhost:8080",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

//--------------------------------------------Middleware-------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("frontend/dist"));

//---------------------------------------------Auth-----------------------------------------------
// Login: POST /api/auth/sign-in/email
// Registration: POST /api/auth/sign-up/email
// Get Session: GET /api/auth/get-session
// Logout: POST /api/auth/sign-out
app.use("/api/auth", (req, res, next) => {
  return toNodeHandler(auth)(req, res, next);
});

//---------------------------------------------Routes-----------------------------------------------
app.use("/api/products", productRouter);
app.use("/api", userRouter);

//--------------------------------------------Database---------------------------------------------
ping();

//------------------------------------------ Start Server -----------------------------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
