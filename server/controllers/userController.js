import { createUser,updateUser,getUserByEmail,getUserById,deleteUser,findAllUsers } from "../models/userModel.js";
import bcrypt from "bcryptjs";
export const createUserController = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists. Please log in." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);


      const newUser = await createUser({
        email,
        username,
        password: hashedPassword,
      });

      res.status(201).json(newUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
  export const getAllUsersController=async(req,res)=>{
    console.log("bhalu bhitra")
    const users=await findAllUsers();
    console.log(users)
    res.status(200).json(users)
  }
  export const getUserByEmailController = async (req, res) => {
    try {
      const { email } = req.query;
      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getUserByIdController = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id)
      const user = await getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const updateUserController = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedUser = await updateUser(id, req.body); // Pass id and new data
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteUserController = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await deleteUser(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found or already deleted" });
      }
      res.status(200).json({ message: "User deleted", user: deletedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  