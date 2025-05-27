require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT 
// const generateToken  = (user) =>{
//     console.log("JWT_SECRET at sign:", process.env.JWT_SECRET); // <--- DEBUG LINE
//     return jwt.sign(
//         {id: user.id,role : user.role},
//         process.env.JWT_Secret,
//         {expiresIn: "7d"}
//     );
// };

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

         console.log(req.body,"req.body")

         // checks if user exits 
        const userExits = await User.findOne({email});
        console.log(userExits,"userExits")
        if(userExits){
            return res.status(400).json({ message: 'User already exists'})
        }

        //create user
        const user = await User.create({name,email,password,role});
        console.log(user,"user")

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

         console.log(req.body,"iuiuu")
        const {email,password} = req.body;
        console.log(req.body,"iuiuu")

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
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {registerUser, loginUser}