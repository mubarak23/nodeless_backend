import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	message: {
		success: false,
		message: "Too many requests, please try again later.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export const generalLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 100,
	message: {
		success: false,
		message: "Too many requests, please try again later.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export const verifymeLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 2, // Allow only 2 requests per minute
	message: {
		success: false,
		message: "Too many requests, please try again later.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});
