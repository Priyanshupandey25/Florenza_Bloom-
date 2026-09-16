import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

//middleware to authenticate user
export const authenticateUser = async (req, res, next)=>{
    const token = req.cookies.token

    if(!token){ 
        return res.status(401).json({message: "Unauthorized access"})
    }   

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if(!user){
            return res.status(401).json({message: "Unauthorized access"})
        }   

        req.user = user
        next()
    } catch(error){
        console.error("Error during authentication:", error)
        return res.status(401).json({message: "Unauthorized access"})
    }    
}

//middleware to authenticate seller
export const authenticateSeller = async (req, res, next)=>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message: "Unauthorized access"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if(user.role !== "seller"){
            return res.status(403).json({message: "Forbidden access"})
        }
        req.user = user 
        next()
    } catch(error){
        console.error("Error during authentication:", error)
        return res.status(401).json({message: "Unauthorized access"})
    }
}