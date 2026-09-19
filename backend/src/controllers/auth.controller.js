import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function register(req, res) {
  const { name, email, password, isSeller } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists",
      success: false,
      err: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role: isSeller ? "seller" : "buyer"
  });

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user registered successfully",
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if(!isPasswordMatch){
    return res.status(400).json({
      message:"Invalid email or password",
      success:false,
      err:"Invalid email or password"
    })
  }

  const token = jwt.sign({
    id:user._id,
    email:user.email,
    role:user.role
  }, process.env.JWT_SECRET, {expiresIn:"7d"})

  res.cookie("token", token)

  res.status(200).json({
    message:"Login successful",
    success:true,
    user:{  
      id:user._id,
      name:user.name,
      email:user.email,
      role:user.role
    }
  })
}

export async function getMe(req, res){
  const userId = req.user._id;

  const user = await userModel.findById(userId).select("-password");

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
  });
}