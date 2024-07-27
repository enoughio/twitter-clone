import jwt from "jsonwebtoken";


export const generateTokenAndSetCookies = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {   
            expiresIn: '15d'
        }
    )

    res.cookie("jwt",  token, {
        maxAge: 15*24*60*60*1000,
        httpOnly:true, // xss cross site scripting attack
        sameSite: "strict",// CSRF attack cross site request 
        secure: process.env.NODE_ENV !== 'development',
    })
}