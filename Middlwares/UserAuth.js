import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import bcrypt, { compare } from "bcrypt";

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        return res.status(400).json({ error: "all fields are required" });
      }
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign(
        { _id: user._id, role: user.role , email, name: user.name},
        process.env.SECRET_TOKEN
      );
  
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(200)
        .json({ message: "Login successful", data: user , token});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


export const logOut = (req, res) => {
    return res
      .clearCookie("token")
      .status(200)
      .json({ message: "Successfully Logged Out!" });
  };