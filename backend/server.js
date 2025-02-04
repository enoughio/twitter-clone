import express from "express";
import dotenv from "dotenv";   // 39min
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

import connectMongoDb from "./db/connectMongoDB.js";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})

const PORT = process.env.PORT || 8000;
const app = express();

// console.log(process.env.MONGO_URI)

app.use(express.json());  
app.use(express.urlencoded({extended: true}))  // to parse form data(urlencoded )

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);


app.get("/", (req,res) => {
    res.send("server is running")
})

app.listen(PORT, () => {
     console.log(`http://localhost:${PORT}/`)
     connectMongoDb();
})
console.log("Running server ")