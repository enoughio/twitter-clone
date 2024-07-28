import express from "express";
import dotenv from "dotenv";   // 39min

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDb from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// console.log(process.env.MONGO_URI)

app.use(express.json());  
app.use(express.urlencoded({extended: true}))  // to parse form data(urlencoded )

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


app.get("/", (req,res) => {
    res.send("server is running")
})

app.listen(PORT, () => {
     console.log(`http://localhost:${PORT}/`)
     connectMongoDb();
})
console.log("Running server ")