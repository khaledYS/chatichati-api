import { Db } from "mongodb";
import { createProfileController } from "../controllers/Profile/createProfile";
import { getProfileController } from "../controllers/Profile/getProfile";

const express = require("express");
const router = express.Router();


router.post("/", createProfileController)
router.get("/", getProfileController)

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

module.exports = router