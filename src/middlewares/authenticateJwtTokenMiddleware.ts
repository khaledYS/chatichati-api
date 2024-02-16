import { NextFunction, Response } from "express";
import { JwtPayload, verifyJWT } from "../utilities/generateJWTtoken";
import { RequestDb, profile } from "../mongoDataTypes";
import { ObjectId } from "mongodb";
export async function authenticateJwtTokenMiddleware(
    req: RequestDb,
    res: Response,
    next: NextFunction
) {
    const { jwt } = req.cookies;
    const {db} = req.app;

    if (jwt == null)
        return res.status(401).json({ message: "Not authenticated" });

    const verifyJwtRes = verifyJWT(jwt) as { ok: boolean; message: JwtPayload };

    if (!verifyJwtRes.ok)
        return res.status(403).json({ message: "Not authorized" });

    // fetch the user from db
    const result = await db.collection("profiles").findOne<profile>({
        _id: new ObjectId(verifyJwtRes.message.id),
    });

    req.user = result;

    next();
}
