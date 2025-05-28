require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;

  console.log("🔐 JWT_SECRET at sign:", secret);
  if (!secret) throw new Error("JWT_SECRET is missing!");

  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};


// Register a new user

const registerUser  = async (req,res)=>{

    try{
         const { name , email ,password, role} = req.body;

         // checks if user exits 
        const userExits = await User.findOne({email});
  
        if(userExits){
            return res.status(400).json({ message: 'User already exists'})
        }

        //create user
        const user = await User.create({name,email,password,role});

        res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user)
    });

    }catch (error) {
        console.log(error,"err")
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req,res)=>{
    try{

        const {email,password} = req.body;

        // 1. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
        // 3. Send response with token
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    }catch(error){
        // console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {registerUser, loginUser}