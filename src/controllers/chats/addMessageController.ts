import { Response } from "express";
import Pusher from "pusher"

export async function addMessageController(req: any, res: Response) {
    try {
        const { message, sentBy, chatId } = req.body;
        const {chats} = req.user;
        const { db } = req.app ;
        // check if the chatId exists on the array of chat ids on the user data
        let isExist = false;
        const checkIfChatIdExists = chats.forEach(element => {
           if(element== chatId) isExist = true; 
        });
        if(!isExist) return res.status(403).json({ok: "not Authorized"});
        
        const pusher = new Pusher({
            appId: "1754370",
            key: "14aaa8a8dc4e553e31ab",
            secret: "5de9238a7a9d8c50ea10",
            cluster: "ap2",
            useTLS: true,
        });

        pusher.trigger("messages", "message", {
            message,
        });
        return res.status(200).json({ok: "done"});
    } catch (error) {
        return res.status(400).json({ok: "error happened"});
    }
}