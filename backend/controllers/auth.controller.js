import { error } from "console";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookies } from "../lib/utils/generateToken.js";

export const signup = async (req,res) => {
    // alert("got it")

      try {
        const {fullName, username, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({error: "invalid email formate"});
        }

        const existingUser = await User.findOne({ username })

        if(existingUser)
            return res.status(400).json({error: "user already exists"});

        const existingEmail = await User.findOne({ email })
        if(existingEmail)
            return res.status(400).json({error: "Email already uesd"});


        if(password.length < 6)
            return res.status(400).json({error: "password must be atleast 6 character"});
        // hash password;
        const salt = await bcrypt.genSalt(10)  // sallting
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            username,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookies(newUser._id, res);
            await newUser.save();
            
            res.status(201).json(
                {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    email: newUser.email,
                    follower: newUser.follower,
                    following : newUser.following,
                    profileImg : newUser.profileImg,
                    coverImg : newUser.coverImg,
                }
            );


        }else{
            console.log("error in auth controller")
            res.status(400).json({error : "invalid user data"});
            throw error;
        }



      } catch (error) {

        console.log("error in signup controller") 

        res.status(500).json({error: "Internal server Error"+error })

      }

}


export const login = async (req, res) => {

      try {

        const {username, password} = req.body;
        const user = await User.findOne({username});
        const ispsswordCorrect = await bcrypt.compare(password, user?.password || "") 
        
        if(!user || !ispsswordCorrect)
            return res.status(400).json({error: "invalid username or password"});
            
        generateTokenAndSetCookies(user._id, res);

        res.status(201).json(
            {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                follower: user.follower,
                following : user.following,
                profileImg : user.profileImg,
                coverImg : user.coverImg,
            }
        );


      } catch (error) {

        console.log("error in login controller") 
        res.status(500).json({error: "Internal server Error"+error })

      }

}


export const logout = (req,res) => {

    try{

        res.cookie("jwt", "" , {maxAge: 0})
        res.status(200).json({message: "logout succesfully",})

    } catch (error) {

    console.log("error in logout controller") 
    res.status(500).json({error: "Internal server Error"+error })

  }
}



export const getMe = async (req,res) => {

    try{
        
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);

    } catch (error) {

    console.log("error in getMe controller") 
    res.status(500).json({error: "Internal server Error"+error })

  }

}