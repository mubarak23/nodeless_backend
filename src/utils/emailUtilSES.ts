/* eslint-env node */
import { SendEmailCommand, SendEmailCommandInput, SESClient } from "@aws-sdk/client-ses";
import sgMail from "@sendgrid/mail";
import ejs from "ejs";
import path from "path";
import config from "../config/config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { ApplicationError } from "./errorHandler";

const fromEmail = config.ses.fromEmail;
const region = config.s3.region || "US-EAST-2";
const accessKeyId = config.ses.access_ses_key_id!;
const secretAccessKey = config.ses.secret_ses_access_key!;

console.log("fromEmail", fromEmail);
const ses = new SESClient({
	region,
	credentials: {
		accessKeyId,
		secretAccessKey,
	},
});

const sendgridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridApiKey!);

class Mail {
	private constructor() {}

	public static generateOtp(length: number): string {
		return Math.random()
			.toString()
			.substring(2, length + 2);
	}

	public static async sendEmail(to: string, subject: string, text: string): Promise<void> {
		const params: SendEmailCommandInput = {
			Destination: {
				ToAddresses: [to],
			},
			Message: {
				Body: {
					Text: {
						Charset: "UTF-8",
						Data: text,
					},
				},
				Subject: {
					Charset: "UTF-8",
					Data: subject,
				},
			},
			Source: fromEmail!,
		};

		try {
			const command = new SendEmailCommand(params);
			const response = await ses.send(command);
			if (response.$metadata.httpStatusCode !== 200) {
				throw new ApplicationError("Failed to send email", HttpStatusCodes.BAD_REQUEST);
			}
		} catch (error) {
			console.error("SES error:", error);
			throw new ApplicationError("Failed to send email", HttpStatusCodes.BAD_REQUEST);
		}
	}

	public static async sendHtmlEmail(to: string, subject: string, templateName: string, data: object): Promise<void> {
		try {
			const templatePath = path.join(__dirname, "../views", `${templateName}.ejs`);
			const htmlContent = await ejs.renderFile(templatePath, data);

			const params: SendEmailCommandInput = {
				Destination: {
					ToAddresses: [to],
				},
				Message: {
					Body: {
						Html: {
							Charset: "UTF-8",
							Data: htmlContent,
						},
					},
					Subject: {
						Charset: "UTF-8",
						Data: subject,
					},
				},
				Source: fromEmail!,
			};

			const command = new SendEmailCommand(params);
			const response = await ses.send(command);

			if (response.$metadata.httpStatusCode !== 200) {
				throw new ApplicationError("Failed to send HTML email", HttpStatusCodes.BAD_REQUEST);
			}
		} catch (error) {
			console.error("SES error:", error);
			throw new ApplicationError("Failed to send email", HttpStatusCodes.BAD_REQUEST);
		}
	}
}

export default Mail;

// role guard

// import { Request, Response, NextFunction } from "express";

// const roleGuard = (roles: string[], permissions: string[] = []) => {
// 	return (req: Request, res: Response, next: NextFunction) => {
// 		const user = req.user as {
// 			role: string;
// 			permissions?: Record<string, boolean>;
// 		};

// 		if (!user || !user.role) {
// 			return res.status(403).json({ message: "Unauthorized: No role found" });
// 		}

// 		const allowedRoles = new Set(roles.map(role => role.toLowerCase()));
// 		const userRole = user.role.toLowerCase();

// 		if (!allowedRoles.has(userRole)) {
// 			return res.status(403).json({ message: "Forbidden: Insufficient role" });
// 		}

// 		if (permissions.length > 0) {
// 			const userPermissions = user.permissions || {};

// 			const hasAllPermissions = permissions.every(perm => userPermissions[perm] === true);

// 			if (!hasAllPermissions) {
// 				return res.status(403).json({
// 					message: "Forbidden: Missing required permissions",
// 				});
// 			}
// 		}

// 		next();
// 	};
// };

// export default roleGuard;
