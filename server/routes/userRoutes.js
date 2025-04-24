// routes/userRoutes.js
import express from "express";
import {
  createUserController,
  getUserByEmailController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getAllUsersController
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUserController); // POST /users
router.get("/all", getAllUsersController)
router.get("/userByEmail", getUserByEmailController); // GET /users/by-email?email=test@mail.com
router.get("/:id", getUserByIdController);         // GET /users/:id
router.put("/:id", updateUserController);          // PUT /users/:id
router.delete("/:id", deleteUserController);       // DELETE /users/:id


export default router;
