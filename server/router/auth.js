import Controller from "../controller/auth.js";
import express from "express";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.post("/login", Controller.login);
router.post("/register", authenticateToken, Controller.registerAdmin);
export default router;
