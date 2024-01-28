import { Response } from "express";

export async function logoutController(req: any, res: Response) {
	return logoutCookieResponse(res);
}

export function logoutCookieResponse(res: Response){
	return res
	.status(401)
	.cookie("signed", false)
	.clearCookie("jwt")
	.clearCookie("username")
	.clearCookie("email")
	.json({ ok: true });
}