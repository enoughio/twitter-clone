import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import connectMongoDb from "./db/connectMongoDB.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// console.log(process.env.MONGO_URI)

app.use("/api/auth", authRoutes);


app.get("/", (req,res) => {
    res.send("server is running")
})

app.listen(PORT, () => {
     console.log(`http://localhost:${PORT}/`)
     connectMongoDb();
})
console.log("Running server ")