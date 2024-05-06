const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createToken = require("../utils/createToken");

exports.signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new Error(
        "Please enter all required fields (username, email, password)"
      );
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    createToken(res, newUser._id);
    return res.send("sign up successful");
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: err.message });
  }
};

exports.signinUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // ค้นหาผู้ใช้ด้วยอีเมล
      const existingUser = await User.findOne({ email });
      
      // ถ้าไม่พบผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
      if (!existingUser) {
          return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // ตรวจสอบรหัสผ่าน
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // ถ้าผ่านการตรวจสอบ
      createToken(res, existingUser._id);
      res.status(201).json({
          _id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin,
      });
      
    } catch (err) {
      console.error(err);
      res.status(400).send({ error: err.message });
    }
  };