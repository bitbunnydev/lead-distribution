import express from "express";
export { getLeads, createLead } from "../controllers/leadController.js";

const router = express.Router();

//Routes
router.get("/", getLeads);
router.post("/", createLead);

export default router;
