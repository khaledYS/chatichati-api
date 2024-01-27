import { Router } from "express";
import { logoutController } from "../controllers/logout/logoutControllers";

const router = Router();

router.delete('/', logoutController)


export default router;
