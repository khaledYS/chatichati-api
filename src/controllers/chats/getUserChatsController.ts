import { Response } from "express";
import { RequestDb } from "../../mongoDataTypes";


export async function getUserChatsController(req: RequestDb, res: Response) {
	const { email, username, signed, jwt } = req.cookies;
	const { db } = req.app;
    const {chats} = req.user;
    console.log(chats, "hi")
    if(!chats && !chats.length ){
        return res.status(200).json({ ok: true, chats: [] });
    }


    return res.status(200).json({ ok: true, chats: chats || [] });
	
}
