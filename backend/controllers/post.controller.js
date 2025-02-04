import Post from "../models/post.model.js";
import User from "../models/user.model.js";

import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
     
    
    try {
        
        const { text } = req.body;
        let { img } = req.body;

        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        
        if(!user) return  res.status(404).json({message: "user not found" });
    
        if( !text && !img ){
            return  res.status(404).json({message: "Post Must have text or img" });
        }
    
        
        if(img)
            {
                const uploadImg = cloudinary.uploader.upload(img);
                const img = (await uploadImg).secure_url;
                
            }
            
        const newPost = new Post( {
            user : userId,
            text,
            img,
        })

         await newPost.save();
         res.status(201).json(newPost);
        
    } catch (error) {
        
        res.status(500).json({error: error.message})
        console.log("error in createPost Controller", error);

    }
}