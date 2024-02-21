import { Response } from "express";
import { RequestDb, profile } from "../../mongoDataTypes";
import { Document } from "mongodb";

export async function getUserChatsController(req: RequestDb, res: Response) {
	const { db } = req.app;
	const { chats } = req.user;
	if (!chats || !chats.length) {
		return res.status(200).json({ ok: true, chats: [] });
	}

	const chatsDocs = await Promise.all(
		chats.map(async (chatCollectionId, ind) => {
			let resultFromDb = await db
				.collection(chatCollectionId)
				.aggregate<profile>(
					[
						{ $match: { _id: "index" } },
						{
							$lookup: {
								from: "profiles",
								localField: "messagers",
								foreignField: "_id",
								as: "messagers",
								pipeline: [
									{
										$project: {
											username: 1,
											email: 1,
											name: 1,
										},
									},
								],
							},
						},
					],
					{ maxTimeMS: 60000, allowDiskUse: true }
				)
				.toArray();
			return { chatId: chatCollectionId, ...resultFromDb[0] };
		})
	);
	// console.log(chatsDocs)
	return res.status(200).json({ ok: true, chats: chatsDocs });
}
