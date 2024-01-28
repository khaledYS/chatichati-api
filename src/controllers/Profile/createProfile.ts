import { InsertOneResult } from "mongodb";
import matches from "validator/lib/matches";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import isMobilePhone from "validator/lib/isMobilePhone";
import { ProfileParamters, dbType } from "../../routes/profile";
import {assign_JWT_token, gAa_JWT_token, generate_JWT_token} from "../../utilities/generateJWTtoken"
import { validate, validateEmail, validateName, validatePassword, validatePhoneNumber, validateUsername } from "../../utilities/validate";
import { hashPassword } from "../../utilities/hashPassword";
import { JwtPayload, decode } from "jsonwebtoken";
import { loginCookieResponse } from "../login/signInControllers";

export async function createProfileController(req: any, res: any) {
	try {
		const { db }:dbType = req.app;
		const { name, email, phone, username, password }: ProfileParamters = req.body;

        // check for the params passed in the req body
        const validatedParams = validate({name, email, phone, username, password});

		// check if profile email exists
		const existingEmail = await db.collection("profiles").findOne({
			email: email.toLowerCase(),
		});
		if (existingEmail) {
			return res
				.status(400)
				.json({ message: "Profile Email already exists" });
		}
		// check if profile username exists
		const existingUsername = await db.collection("profiles").findOne({
			username: username.toLowerCase(),
		});
		if (existingUsername) {
			return res
				.status(400)
				.json({ message: "Profile Username already exists" });
		}

        // hashing the password
        const hashedPassword = await hashPassword(password);
        
		const result: InsertOneResult = await db
        .collection("profiles")
        .insertOne({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            name,
            phone,
            password: hashedPassword
        });
        

        // res.json(result)
		if (result.acknowledged) {

            // generating the JWT token and assigning 
            const JWT_token = await gAa_JWT_token(result.insertedId.toString(), db)
			// getting the end date of the jwt
			const {exp} = decode(JWT_token.jwt) as JwtPayload;

			return loginCookieResponse({jwtToken: JWT_token.jwt, exp, username, email, status:201}, res)
		} else {
			throw new Error("Profile could not be created");
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.toString() });
	}
}
