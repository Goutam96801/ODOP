import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import User from "./Schema/User.js";

const app = express();
const PORT = 8000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL, {
    autoIndex:true
});

app.post("/signup", async(req, res) => {
    const {name, email, password, role, district, aadharCard } = req.body;

    if (!email || !password || !name || !role) {
        return res.status(400).send({ message: 'Missing required fields' });
      }

    if (!email.match(emailRegex) || !password.match(passwordRegex)) {
    return res.status(400).send({ message: 'Invalid email or password format' });
    }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    // Create new user
    bcrypt.hash(password, 10, async(err, hashedPassword) => {
      const user = new User({
        name,
        email,
        role,
        password:hashedPassword,
        address: {
          district,
          state: 'Jammu and Kashmir',
          country: 'India'
        },
        aadharCard: role === 'seller' ? aadharCard : undefined 
      });
      await user.save()

          // Generate token (you can adjust the secret and expiration)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).send({ message: 'User created successfully', token });
  

})
  } catch(error){
    return res.status(500).json({"error":error.message})
  }
});

app.post("/signin", async(req, res) => {
  const {email, password} = req.body;

  if(!email || !password){
    return res.status(400).send({message: "Email and Password are required!"})
  }

  try{
    const user = await User.findOne({email});
    if(!user){
      return res.status(401).send({message: "Email is not registered"})
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if(!isPasswordMatch){
      return res.status(401).send({message: "Incorrect Password"})
    }

    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

    res.status(200).send({messgae: "Login successful", token})

  } catch(error){
    res.status(500).send({message: "Internal server error", error: error.message})
  }
})


app.listen(PORT, () => {
    console.log("Server is running at port: " + PORT)
})