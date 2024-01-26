import { Router } from "express";
import { verifyJwtController } from "../controllers/jwt/verifyControllers";

const router = Router();

router.get('/verify', verifyJwtController)

module.exports = router