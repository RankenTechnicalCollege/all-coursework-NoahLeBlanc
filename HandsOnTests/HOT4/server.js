import express from "express";
import dotenv from "dotenv";

//------------------Routes------------------------//

import { ping } from "./middleware/database.js";
import { productRouter } from "./routes/api/product.js";

dotenv.config();

//-------------------------------------------- Config ---------------------------------------------
const port = process.env.PORT || 2023;
const app = express();

//--------------------------------------------Middleware-------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("frontend/dist"));

//---------------------------------------------Route-----------------------------------------------
app.use("/api/products", productRouter);
//--------------------------------------------Database---------------------------------------------
ping();

//------------------------------------------ Start Server -----------------------------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
