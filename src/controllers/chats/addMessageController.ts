import Pusher from "pusher"

export async function addMessageController(req: any, res: any) {
    try {
        const { message } = req.body;

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
