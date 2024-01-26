import { Db, ObjectId, UpdateResult } from "mongodb";
import { compare, hash } from "bcrypt";

const saltRounds = 10;

// hashing the paassword
async function hashPassword(password: string): Promise<string> {
	const hashedPassword = await hash(password, 10);
	return hashedPassword;
}

// Assigning the token to the db
async function assignHashedPassword(
	hashedPassword: string,
	id: string,
	db: Db
): Promise<UpdateResult> {
	const req = await db.collection("profiles").updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: {
				password: hashedPassword,
			},
		}
	);
	return req;
}

// Generating and assigning hash password
async function hAaHashedPassword(
	password: string,
	id: string,
	db: Db
): Promise<{result:UpdateResult; hashedPassword: string}> {
	const hashedPassword = await hashPassword(password);
	const result = await assignHashedPassword(hashedPassword, id, db);
	return { result, hashedPassword };
}

async function compareHashedPassword(hashedPassword:string, password:string):Promise<boolean> {
    const result = await compare(password, hashedPassword)
    return result
}

export {
	hashPassword,
	assignHashedPassword,
	hAaHashedPassword,
    compareHashedPassword
};
