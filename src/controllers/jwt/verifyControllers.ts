import { Request, Response } from "express";
import { ProfileParamters, dbType } from "../../routes/profile";
import { JwtPayload, verifyJWT } from "../../utilities/generateJWTtoken";
import { validate } from "../../utilities/validate";
import { RequestDb, expressDb } from "../../mongoDataTypes";
import { ObjectId } from "mongodb";

export async function verifyJwtController(req: RequestDb, res: Response) {
	const { email, username, signed, jwt } = req.cookies;
	const { db } = req.app;

	// check from the provided inputs
	const validateRes = validate({ email, username });
	if (!validateRes.ok || !jwt || !signed) {
		return res.redirect("/.netlify/functions/v1/api/logout");
	}

	// verifying jwt
	const verifyJwtRes = verifyJWT(jwt) as {ok:boolean, message: JwtPayload};
	if(!verifyJwtRes.ok){
	    return res.redirect("/.netlify/functions/v1/api/logout")
	}

    // verifying the jwt matches with the email and username
    const jwtProfile = await db.collection("profiles").findOne<ProfileParamters>({
        _id: new ObjectId(verifyJwtRes.message.id)
    });
    const emailUsernameProfile = await db.collection("profiles").findOne<ProfileParamters>({
        email: email,
        username: username, 

    });
    if(!jwtProfile || !emailUsernameProfile ){
	    return res.redirect("/.netlify/functions/v1/api/logout")
    }

	// return res.status(200).json({message: verifyJwtRes.message})
	return res.status(200).json({ message: email });
}
