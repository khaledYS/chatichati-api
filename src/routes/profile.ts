import { Db } from "mongodb";
import { Router } from "express";
import { createProfileController } from "../controllers/Profile/createProfile";
import { getProfileByIdController } from "../controllers/Profile/getProfileById";
import { getProfileByUsernameController } from "../controllers/Profile/getProfileByUsername";
import { getProfileByEmailController } from "../controllers/Profile/getProfileByEmail";

const router = Router();


router.post("/", createProfileController)
router.get("/", getProfileByIdController)
router.get("/id", getProfileByIdController)
router.get("/username", getProfileByUsernameController)
router.get("/email", getProfileByEmailController)

export interface ProfileParamters {
	name: string;
	email: string;
	username: string;
	phone: string;
    password: string;
	jwt?: string;
	chats: [any];
}

export interface dbType{
    db: Db
}

export default router