import { Router } from "express";
import { handleSignup } from "../controllers/signup.controller.js";

const router = Router();

router.post("/sign_up", handleSignup);

export default router;
