import fs from "fs";
import path from "path";
import winston from "winston";

const logDir = "logs";

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, errors, colorize, splat } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Winston logger configuration
const logger = winston.createLogger({
	level: "info",
	format: combine(
		colorize(),
		splat(), // Allow string interpolation
		timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		errors({ stack: true }),
		customFormat
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.join(logDir, "error.log"),
			level: "error",
			maxsize: 5 * 1024 * 1024, // 5MB
			maxFiles: 5,
		}),
		new winston.transports.File({
			filename: path.join(logDir, "warn.log"),
			level: "warn",
			maxsize: 5 * 1024 * 1024,
			maxFiles: 5,
		}),
		new winston.transports.File({
			filename: path.join(logDir, "info.log"),
			level: "info",
			maxsize: 10 * 1024 * 1024,
			maxFiles: 5,
		}),
		new winston.transports.File({
			filename: path.join(logDir, "debug.log"),
			level: "debug",
			maxsize: 10 * 1024 * 1024,
			maxFiles: 5,
		}),
		new winston.transports.File({
			filename: path.join(logDir, "combined.log"),
			maxsize: 10 * 1024 * 1024,
			maxFiles: 5,
		}),
	],
	exceptionHandlers: [new winston.transports.File({ filename: path.join(logDir, "exceptions.log") })],
});

process.on("unhandledRejection", (reason: unknown) => {
	if (reason instanceof Error) {
		logger.error(`Unhandled Rejection: ${reason.stack || reason.message}`);
	} else {
		logger.error(`Unhandled Rejection: ${String(reason)}`);
	}
});

export default logger;
