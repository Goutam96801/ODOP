import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from "nanoid";
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
    const user = new User({
      name,
      email,
      role,
      address: {
        district,
        state: 'Jammu and Kashmir',
        country: 'India'
      },
      aadharCard: role === 'seller' ? aadharCard : undefined 
    });

    await user.save();

    // Generate token (you can adjust the secret and expiration)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).send({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error: error.message });
  }

})


app.listen(PORT, () => {
    console.log("Server is running at port: " + PORT)
})