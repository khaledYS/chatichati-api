import dotenv from "dotenv";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, sign, verify } from "jsonwebtoken";
import { Db, ObjectId, UpdateResult } from "mongodb";

dotenv.config();
const secret_token = process.env.SECRET_TOKEN;

function generate_JWT_token(id: string): string {
	// generating the token
	const JWT_token = sign({ id }, secret_token, {
		// expiresIn: 5, // 5 seconds
		expiresIn: (60 ^ 2) * 24 * 30, // 30 Days
	});

	return JWT_token;
}

// Assigning the token to the db
async function assign_JWT_token(
	id: string,
	JWT_token: string,
	db: Db
): Promise<UpdateResult> {
	const req = await db.collection("profiles").updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: {
				jwt: JWT_token,
			},
		}
	);
	return req;
}

async function gAa_JWT_token(
	id: string,
	db: Db
): Promise<{ result: UpdateResult; jwt: string }> {
	const JWT_token = generate_JWT_token(id);
	const result = await assign_JWT_token(id, JWT_token, db);
	return { result, jwt: JWT_token };
}

/**
 * 
 * @param JWT_token 
 * @returns {
 * 	ok: boolean,
 * 	message: {id:string, iat:number, exp:number} | "TokenExpiredError" | "JsonWebTokenError"
 * }
 */
function verifyJWT(JWT_token:string):{ok:boolean, message: "TokenExpiredError" | "JsonWebTokenError" | string | JwtPayload  } {
	try {
		const result = verify(JWT_token, secret_token);
		return {
			ok: true,
			message: result
		};
	} catch (error) {
		return {
			ok: false,
			message: error.name
		}	
	}
}

export { generate_JWT_token, assign_JWT_token, gAa_JWT_token, verifyJWT };
