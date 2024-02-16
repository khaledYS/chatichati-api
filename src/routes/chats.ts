import { Router } from "express";
import { addMessageController, getUserChatsController } from "../controllers/chats/chatsControllers";
import { authenticateJwtTokenMiddleware } from "../middlewares/authenticateJwtTokenMiddleware";

const router = Router();

router.get('/', authenticateJwtTokenMiddleware, getUserChatsController)


export default router;
