import {
	DeleteObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	PutObjectCommandInput,
	S3Client,
} from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import sharp from "sharp";
import { URL } from "url";
import config from "../config/config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { ApplicationError } from "./errorHandler";
import { Express } from "express";

class S3Upload {
	private static instance: S3Upload;
	private s3: S3Client;
	private bucket: string;
	private region: string;

	private constructor() {
		this.region = config.s3.region || "eu-north-1";
		this.bucket = config.s3.bucket!;
		const accessKeyId = config.s3.access_key_id!;
		const secretAccessKey = config.s3.secret_access_key!;

		this.s3 = new S3Client({
			region: this.region,
			credentials: { accessKeyId, secretAccessKey },
		});
	}

	public static getInstance(): S3Upload {
		if (!S3Upload.instance) {
			S3Upload.instance = new S3Upload();
		}
		return S3Upload.instance;
	}

	private buildS3Key(file: Express.Multer.File): string {
		const folder = this.determineFolder(file.mimetype);
		const timestamp = Date.now();
		return `${folder}/${timestamp}-${file.originalname}`;
	}

	private determineFolder(mimetype: string): string {
		if (mimetype.startsWith("image/")) return "images";
		if (mimetype.startsWith("video/")) return "videos";
		if (mimetype.startsWith("audio/")) return "audio";
		return "others";
	}

	private extractKeyFromUrl(fileUrl: string): string {
		try {
			const url = new URL(fileUrl);
			// Extract the pathname and remove the leading '/'
			return url.pathname.substring(1);
		} catch (error) {
			throw new ApplicationError(`Invalid URL: ${error}`, HttpStatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	public async uploadImageFile(file: Express.Multer.File) {
		const key = this.buildS3Key(file);

		let resizedBuffer: Buffer;
		try {
			resizedBuffer = await sharp(file.buffer)
				.resize({ width: 1024, height: 1024, fit: "inside" })
				.jpeg({ quality: 80 })
				.toBuffer();
		} catch (error) {
			throw new ApplicationError(`Image resizing failed: ${error}`, HttpStatusCodes.INTERNAL_SERVER_ERROR);
		}

		const input: PutObjectCommandInput = {
			Body: resizedBuffer,
			Bucket: this.bucket,
			Key: key,
			ContentType: file.mimetype,
			ACL: "public-read",
		};

		try {
			const response = await this.s3.send(new PutObjectCommand(input));
			if (response.$metadata.httpStatusCode === 200) {
				return {
					message: "File uploaded successfully",
					image: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
				};
			}
			throw new ApplicationError("Image not saved in S3!", HttpStatusCodes.BAD_REQUEST);
		} catch (error: unknown) {
			throw new ApplicationError(`Cannot save file to S3, ${error}`, HttpStatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	public async uploadPdfToS3(file: Express.Multer.File) {
		if (file.mimetype !== "application/pdf") {
			throw new ApplicationError("Only PDF files are allowed", HttpStatusCodes.BAD_REQUEST);
		}
		const key = this.buildS3Key(file);

		const input: PutObjectCommandInput = {
			Body: file.buffer,
			Bucket: this.bucket,
			Key: key,
			ContentType: file.mimetype,
			ACL: "public-read",
		};

		try {
			const response = await this.s3.send(new PutObjectCommand(input));
			if (response.$metadata.httpStatusCode === 200) {
				return {
					message: "File uploaded successfully",
					image: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
				};
			}
			throw new ApplicationError("PDF not saved in S3!", HttpStatusCodes.BAD_REQUEST);
		} catch (error: unknown) {
			throw new ApplicationError(`PDF save file to S3, ${error}`, HttpStatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteImageFile(fileUrl: string): Promise<unknown> {
		const bucket = this.bucket;

		try {
			const key = this.extractKeyFromUrl(fileUrl);

			// Check if the file exists in the bucket
			await this.s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));

			// If it exists, delete the file
			await this.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));

			return { message: "File deleted successfully", deleted: fileUrl };
		} catch (error: unknown) {
			throw new ApplicationError("Failed to Delete Image", HttpStatusCodes.BAD_REQUEST);
		}
	}

	async deleteImageFiles(fileUrls: string[]): Promise<unknown> {
		const bucket = this.bucket;
		const deleted: string[] = [];
		const errors: { file: string; reason: string }[] = [];

		for (const fileUrl of fileUrls) {
			try {
				const key = this.extractKeyFromUrl(fileUrl);

				// Check if the file exists in the bucket
				await this.s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));

				// If it exists, delete the file
				await this.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));

				deleted.push(fileUrl);
			} catch (error: unknown) {
				throw new ApplicationError("Failed to Delete Images", HttpStatusCodes.BAD_REQUEST);
			}
			return { message: "File(s) deleted successfully", deleted };
		}
	}
}

export default S3Upload.getInstance();
