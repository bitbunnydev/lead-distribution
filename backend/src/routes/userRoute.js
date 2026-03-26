import express from "express";
import {
  requestAgent,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

//Routes
router.get("/", getAllUsers);
router.post("/request-agent", requestAgent);
router.post("/approve-email/:id", approveEmail);
router.post("/add-admin", addAdmin);

export default router;
