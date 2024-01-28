import { Router } from "express";
import { logoutController } from "../controllers/logout/logoutControllers";

const router = Router();

router.all('/', logoutController)


export default router;
