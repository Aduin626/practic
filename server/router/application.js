import Controller from "../controller/application.js";
import express from "express";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.post("/application", Controller.create);
router.get("/application", authenticateToken, Controller.get);
router.put("/application/:id",authenticateToken, Controller.accept);
router.delete("/application/:id", authenticateToken, Controller.refuse);

export default router;
