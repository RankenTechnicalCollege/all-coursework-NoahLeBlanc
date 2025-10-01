import express from "express";
import dotenv from "dotenv";

import { userRouter } from "./routes/api/user.js";
import { ping } from "./database.js";

dotenv.config();

//-------------------------------------------- Config ---------------------------------------------
const port = process.env.PORT || 5050;
const app = express();

//--------------------------------------------Middleware-------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("frontend/dist"));

//---------------------------------------------Route-----------------------------------------------
app.use("/api/user", userRouter);
//app.use("api/bugs", bugsRouter);
//--------------------------------------------Database---------------------------------------------
ping();

//------------------------------------------ Start Server -----------------------------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
