import { loginParam } from "../../routes/login";
import { validate } from "../../utilities/validate";
import { dbType } from "../../routes/profile";
import { RequestDb, findOneProfileResult, profile } from "../../mongoDataTypes";
import { compareHashedPassword } from "../../utilities/hashPassword";
import { gAa_JWT_token, verifyJWT } from "../../utilities/generateJWTtoken";
import { Response } from "express";
import { JwtPayload, decode } from "jsonwebtoken";

export async function signInWithUsernameController(req: any, res: Response) {
	const { db }: dbType = req.app;
	const { username: reqUsername, password }: loginParam = req.body;

	// check from the validity of the inputs
	if (!reqUsername || !password) {
		return res
			.status(400)
			.json({ message: "Username or password should be provided" });
	}

	//check wether the inputs are valid or not ;
	const validityRes = validate({ username: reqUsername, password });
	if (!validityRes.ok) {
		return res.status(400).json({ message: validityRes.message });
	}

	// finding the user
	const result = await db
		.collection("profiles")
		.findOne<findOneProfileResult>({ username: reqUsername.toLowerCase() });
	if (!result) {
		return res.status(404).json({
			message:
				"Couldn't find the user you are looking for, check your inputs.",
		});
	}
	const {email, username} = result;

	// checking the password
	const hashedPassword = result.password;
	const comparePasswordsResult = await compareHashedPassword(
		hashedPassword,
		password
	);
	if (!comparePasswordsResult) {
		return res.status(401).json({ message: "Wrong password" });
	}

	// make sure there is jwt to pass;
	let jwtToken = result?.jwt;
	if (!jwtToken) {
		const generatedToken = await gAa_JWT_token(result._id, db);
		jwtToken = generatedToken.jwt;
	}

	// verify the expirey date of jwt, returning the exp date of
	const verifyJwtRes = verifyJWT(jwtToken);
	if (!verifyJwtRes.ok) {
		// if expired, generate new one.
		if (
			verifyJwtRes.message == "TokenExpiredError" ||
			verifyJwtRes.message == "JsonWebTokenError"
		) {
			const generatedToken = await gAa_JWT_token(result._id, db);
			jwtToken = generatedToken.jwt;
		}
	}

	const { exp } = decode(jwtToken) as JwtPayload;

	return loginCookieResponse({jwtToken, exp, email, username:reqUsername}, res)

}

export async function signInWithEmailController(req: any, res: Response) {
	const { db }: dbType = req.app;
	const { email: reqEmail, password }: loginParam = req.body;

	// check from the validity of the inputs
	if (!reqEmail || !password) {
		return res
			.status(400)
			.json({ message: "Email or password should be provided" });
	}

	//check wether the inputs are valid or not ;
	const validityRes = validate({ email: reqEmail, password });
	if (!validityRes.ok) {
		return res.status(400).json({ message: validityRes.message });
	}

	// finding the user
	const result = await db
		.collection("profiles")
		.findOne<findOneProfileResult>({ email: reqEmail.toLowerCase() });
		if (!result) {
			return res.status(404).json({
				message:
				"Couldn't find the user you are looking for, check your inputs.",
			});
		}
		const {email, username} = result;

	// checking the password
	const hashedPassword = result.password;
	const comparePasswordsResult = await compareHashedPassword(
		hashedPassword,
		password
	);
	if (!comparePasswordsResult) {
		return res.status(401).json({ message: "Wrong password" });
	}

	// make sure there is jwt to pass;
	let jwtToken = result?.jwt;
	if (!jwtToken) {
		const generatedToken = await gAa_JWT_token(result._id, db);
		jwtToken = generatedToken.jwt;
	}

	// verify the expirey date of jwt, returning the exp date of
	const verifyJwtRes = verifyJWT(jwtToken);
	if (!verifyJwtRes.ok) {
		// if expired, generate new one.
		if (
			verifyJwtRes.message == "TokenExpiredError" ||
			verifyJwtRes.message == "JsonWebTokenError"
		) {
			const generatedToken = await gAa_JWT_token(result._id, db);
			jwtToken = generatedToken.jwt;
		}
	}

	const { exp } = decode(jwtToken) as JwtPayload;

	return loginCookieResponse({jwtToken, exp, email: reqEmail, username}, res)
}

interface loginCookieResponseParamters{
	jwtToken:string,
	exp: number,
	signed?: boolean,
	username: string,
	email:string,
	status?: number
}
export function loginCookieResponse({jwtToken, exp, email, username, status=200, signed=true}:loginCookieResponseParamters, res:Response){
	return res
		.status(status)
		.cookie("jwt", jwtToken, { maxAge: exp, httpOnly: true, sameSite: "strict" })
		.cookie("signed", signed)
		.cookie("username", username)
		.cookie("email", email)
		.json({email, username, signed, ok: true});
}

// create functions that tests my code above