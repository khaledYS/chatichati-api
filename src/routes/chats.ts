import { Router } from "express";
import { addMessageController, getUserChatsController } from "../controllers/chats/chatsControllers";
import { authenticateJwtTokenMiddleware } from "../middlewares/authenticateJwtTokenMiddleware";

const router = Router();

router.get('/', authenticateJwtTokenMiddleware, getUserChatsController)
router.post('/message', authenticateJwtTokenMiddleware, addMessageController)


export default router;
