import { loginParam } from "../../routes/login";
import { validate } from "../../utilities/validate";
import { dbType } from "../../routes/profile";
import { findOneProfileResult, profile } from "../../mongoDataTypes";
import { compareHashedPassword } from "../../utilities/hashPassword";
import { gAa_JWT_token, verifyJWT } from "../../utilities/generateJWTtoken";
import { Response } from "express";
import { JwtPayload, decode } from "jsonwebtoken";

export async function signInWithUsernameController(req: any, res: Response) {
	const { db }: dbType = req.app;
	const { username, password }: loginParam = req.body;

	// check from the validity of the inputs
	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username or password should be provided" });
	}

	//check wether the inputs are valid or not ;
	const validityRes = validate({ username, password });
	if (!validityRes.ok) {
		return res.status(400).json({ message: validityRes.message });
	}

	// finding the user
	const result = await db
		.collection("profiles")
		.findOne<findOneProfileResult>({ username: username.toLowerCase() });
	if (!result) {
		return res.status(404).json({
			message:
				"Couldn't find the user you are looking for, check your inputs.",
		});
	}

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

	return res
		.status(200)
		.cookie("jwt", jwtToken, { maxAge: exp, httpOnly: true })
		.cookie("signed", true)
		.cookie("username", result.username)
		.cookie("email", result.email)
		.json({ ok: true });
}

export async function signInWithEmailController(req: any, res: Response) {
	const { db }: dbType = req.app;
	const { email, password }: loginParam = req.body;

	// check from the validity of the inputs
	if (!email || !password) {
		return res
			.status(400)
			.json({ message: "Email or password should be provided" });
	}

	//check wether the inputs are valid or not ;
	const validityRes = validate({ email, password });
	if (!validityRes.ok) {
		return res.status(400).json({ message: validityRes.message });
	}

	// finding the user
	const result = await db
		.collection("profiles")
		.findOne<findOneProfileResult>({ email: email.toLowerCase() });
	if (!result) {
		return res.status(404).json({
			message:
				"Couldn't find the user you are looking for, check your inputs.",
		});
	}

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

	return res
		.status(200)
		.cookie("jwt", jwtToken, { maxAge: exp, httpOnly: true })
		.cookie("signed", true)
		.cookie("username", result.username)
		.cookie("email", result.email)
		.json({ ok: true });
}
