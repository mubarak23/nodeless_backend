/* eslint-env node */
import { createClient } from "smtpexpress";
import ejs from "ejs";
import path from "path";
import config from "../config/config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { ApplicationError } from "./errorHandler";

// Initialize SMTPExpress client
const smtpexpressClient = createClient({
	projectId: config.smtpExpress.projectId!,
	projectSecret: config.smtpExpress.projectSecret!,
});

const fromEmail = config.smtpExpress.senderMail!;
const fromName = config.smtpExpress.senderName || "Reala";

class Mail {
	private constructor() {}

	public static generateOtp(length: number): string {
		return Math.random()
			.toString()
			.substring(2, length + 2);
	}

	public static async sendEmail(to: string, subject: string, message: string): Promise<void> {
		try {
			await smtpexpressClient.sendApi.sendMail({
				subject,
				message,
				sender: {
					name: fromName,
					email: fromEmail,
				},
				recipients: to,
			});
		} catch (error) {
			throw new ApplicationError("Failed to send email", HttpStatusCodes.BAD_REQUEST);
		}
	}

	public static async sendHtmlEmail(to: string, subject: string, templateName: string, data: object): Promise<void> {
		try {
			const templatePath = path.join(__dirname, "../views", `${templateName}.ejs`);
			const htmlContent = await ejs.renderFile(templatePath, data);

			await smtpexpressClient.sendApi.sendMail({
				subject,
				message: htmlContent,
				sender: {
					name: fromName,
					email: fromEmail,
				},
				recipients: to,
			});
		} catch (error) {
			throw new ApplicationError("Failed to send HTML email", HttpStatusCodes.BAD_REQUEST);
		}
	}
}

export default Mail;
