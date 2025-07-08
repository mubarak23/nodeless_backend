import cors from "cors";
import "express";
import express, { Application } from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import appRoutes from ".";
import rootRoutes from "./api/root/root.controller";
import { authLimiter, generalLimiter, verifymeLimiter } from "./middleware/ratelimitter";
import { setupSwagger } from "./swagger";
import { ErrorHandler } from "./utils/errorHandler";

const app: Application = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: process.env.SESSION_SECRET || "mysecret", // Use a strong secret
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production", // Secure in production
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		},
	})
);




app.use("/api/v1/auth", authLimiter);

app.use("/api/v1", generalLimiter);

app.use("/api/v1/users/verify", verifymeLimiter);

app.use("/", rootRoutes);
app.use("/api", appRoutes);

setupSwagger(app);

app.use(ErrorHandler);

export default app;
