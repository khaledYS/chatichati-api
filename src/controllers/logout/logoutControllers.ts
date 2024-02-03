import { Response } from "express";
import { cookieOptions } from "../login/signInControllers";

export async function logoutController(req: any, res: Response) {
	return logoutCookieResponse(res);
}

export function logoutCookieResponse(res: Response){
	return res
	.status(201)
	.clearCookie("signed")
	.clearCookie("jwt")
	.clearCookie("username")
	.clearCookie("email")
	.json({ ok: true });
}