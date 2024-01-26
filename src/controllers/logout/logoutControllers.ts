import { Response } from "express";

export async function logoutController(req: any, res: Response) {
	return res
		.status(200)
		.cookie("signed", false)
		.clearCookie("jwt")
		.clearCookie("username")
		.clearCookie("email")
		.json({ ok: true });
}
