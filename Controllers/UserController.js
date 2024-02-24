import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userController = {
  register: async (req, res) => {
    const { name, email,password, role ,phone} = req.body;

    try {
      if (!password || typeof password !== "string") {
        return res
          .status(400)
          .json({ message: "Invalid password in the request body" });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const Rounds = 10;
      const hashedPassword = await bcrypt.hash(password, Rounds);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        phone,
        image:req.file?req.file.path:null
      });
      await newUser.save();

      const token = jwt.sign(
        { _id: newUser._id, role: newUser.role, email, name },
        process.env.SECRET_TOKEN,
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      return res.status(201).json({ user: newUser, token });
    } catch (error) {
      console.log(error);
      return  res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getOneUser: async (req, res) => {
    const userId = req.user._id;
    try {
      // return res.json({user:req.user})
      const user = await User.findById(userId);
      if (user) {
        return  res.status(200).json({user:user});
      } else {
        return  res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.log(error);
      return  res.status(500).json({ error: "Internal Server Error" + error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const allUsers = await User.find();
      return   res.status(200).json(allUsers);
    } catch (error) {
      return  res.status(500).json({ message: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return    res.status(404).json({ message: "User not found" });
        return;
      }
      return  res.status(200).json(user);
    } catch (error) {
      return  res.status(500).json({ message: "key one" + error.message });
    }
  },

  updateUserById: async (req, res) => {
    try {
      const { name,email, password, oldPasswordInput, role,phone } = req.body;
  
      if (password && (typeof password !== "string" || password.length === 0)) {
        return res.status(400).json({ message: "Invalid password in the request body" });
      }
  
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      let isOldPasswordValid = true;
  
      if (password) {
        isOldPasswordValid = await bcrypt.compare(oldPasswordInput, user.password);
  
        if (!isOldPasswordValid) {
          return res.status(401).json({ message: "Invalid old password" });
        }
        const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;

        user.password=hashedPassword
      }
  
    
        if(name){
          user.name=name
        }
  
        if(email){
          user.email=email
        }

        if(role){
          user.role=role
        }
        if(phone){
          user.phone=phone
        }
        if(req.file){
          user.image=req.file.path
        }
        console.log(req.body)
        const updatedUser= await user.save()
  console.log(updatedUser)
      return  res.status(200).json(updatedUser);
    } catch (error) {
      return  res.status(500).json({ message: error.message });
    }
  },

  // Delete a user by ID
  deleteUserById: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return  res.status(500).json({ message: error.message });
    }
  },
};

export default userController;