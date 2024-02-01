import { Response } from "express";
import { cookieOptions } from "../login/signInControllers";

export async function logoutController(req: any, res: Response) {
	return logoutCookieResponse(res);
}

export function logoutCookieResponse(res: Response){
	return res
	.status(201)
	.cookie("signed", false, cookieOptions)
	.clearCookie("jwt", cookieOptions)
	.clearCookie("username", cookieOptions)
	.clearCookie("email", cookieOptions)
	.json({ ok: true });
}