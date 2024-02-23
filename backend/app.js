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
  autoIndex: true
});

const formatDatatoSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  return {
    access_token,
    profile_img: user.profile_img,
    fullname: user.fullname,
    email: user.email,
    username: user.username,

  }

}

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  const isUsernameNotUnique = await User.exists({ "username": username }).then((result) =>
      result);

  isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";

  return username;
}

app.post("/signup", async (req, res) => {
  const { fullname, email, password, role } = req.body;

  if (!email || !password || !fullname || !role) {
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
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const username = await generateUsername(email);
      const user = new User({
        fullname,
        email,
        role,
        password: hashedPassword,
        username,
      });
      await user.save().then((u) => {
        return res.status(200).json(formatDatatoSend(u));
      })

    })
  } catch (error) {
    return res.status(500).json({ "error": error.message })
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and Password are required!" })
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Email is not registered" })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send({ message: "Incorrect Password" })
    }

    const access_token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(200).json(formatDatatoSend(user))

  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message })
  }
})


app.listen(PORT, () => {
  console.log("Server is running at port: " + PORT)
})