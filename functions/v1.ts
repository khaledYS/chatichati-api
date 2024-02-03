import express, { Router, Express } from "express";
import { Db, MongoClient } from "mongodb";
import ServerlessHttp from "serverless-http";
import body from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import profileRouter from "../src/routes/profile"
import jwtRouter from "../src/routes/jwt"
import loginRouter from "../src/routes/login"
import logoutRouter from "../src/routes/logout"
import { expressDb } from "../src/mongoDataTypes";

dotenv.config();


const port = Number(process.env.PORT) | 3000;
const mongoDbUri = process.env.MONGODB_URI;

const app:expressDb = express();
const mongo = new MongoClient(mongoDbUri);
(async ()=>{
	await mongo.connect();
})()
app.db = mongo.db();
const router = Router();

// middlewares
app.use(cors({
    credentials: true,
	origin: process.env.ALLOWED_ORIGIN
}));
app.use(cookieParser())
// app.use(express.json());
//body parser
app.use(
	body.json({
		limit: "500kb",
	})
);

// Routes
router.use("/api/profile",profileRouter);
router.use("/api/jwt",jwtRouter);
router.use("/api/login",loginRouter);
router.use("/api/logout",logoutRouter);

// check the server is running
router.get("/", (req, res) => {
	return res.status(200).json({
		message: `the server is up and running on port ${port}`,
	});
	
});

app.use("/.netlify/functions/v1/", router)


exports.handler = ServerlessHttp(app);
