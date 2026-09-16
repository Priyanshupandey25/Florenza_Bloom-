import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists",
      success: false,
      err: "User already exists",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userModel.create({ username, email, password: hashedPassword });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );
 res.status(201).json({
    message: "user registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({email})

  if(!user){
    return res.status(400).json({
      message:"Invalid email or password",
      success:false,
      err:"Invalid email or password"
    })
  }

  const isPasswordMatch = await user.comparePassword(password)

  if(!isPasswordMatch){
    return res.status(400).json({
      message:"Invalid email or password",
      success:false,
      err:"Invalid email or password"
    })
  }

  if(!user.verified) {
    return res.status(400).json({
      message:"Please verify your email before logging in",
      success:false,
      err:"Email not verified"
    })
  }

  const token = jwt.sign({
    id:user._id,
    email:user.email
  }, process.env.JWT_SECRET, {expiresIn:"7d"})

  res.cookie("token", token)

  res.status(200).json({
    message:"Login successful",
    success:true,
    user:{  
      id:user._id,
      username:user.username,
      email:user.email
    }
  })
}

export async function getMe(req, res){
  const userId = req.user.id

  const user = await userModel.findById(userId).select("-password")

  if(!user){
    return res.status(404).json({
      message:"User not found",
      success:false,
      err:"User not found"
    })
  }

  res.status(200).json({
    message:"User fetched successfully",
    success:true,
    user
  })
}