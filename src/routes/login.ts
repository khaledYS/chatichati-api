import { Router } from "express";
import { signInWithEmailController, signInWithUsernameController } from "../controllers/login/signInControllers";

const router = Router();

router.post('/username', signInWithUsernameController)
router.post('/email', signInWithEmailController)

export interface loginParam{
    email?: string;
    username?: string;
    password: string;
}

module.exports = router