import config from "../config/config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { ApplicationError } from "./errorHandler";
import axios from "axios";
import {
	BvnBooleanVerificationResponse,
	QoreIDTokenResponse,
	VerifyNINMatchInput,
} from "../api/v1/User/interface/index";

const QOREID_URL = config.verifyMe.qoreidUrl;

export async function verifyBvnMatch({ idNumber, firstname, lastname }: VerifyNINMatchInput): Promise<unknown> {
	const clientId = config.verifyMe.clientId;
	const secret = config.verifyMe.secretId;

	if (!secret || !clientId) {
		throw new ApplicationError("Failed to configure verification service", HttpStatusCodes.BAD_REQUEST);
	}

	const verifymeAuthToken = await verifyMeAuthToken(clientId, secret);
	const url = `${QOREID_URL}/v1/ng/identities/bvn-match/${idNumber}`;

	try {
		const response = await axios.post(
			url,
			{ firstname, lastname },
			{
				headers: {
					accept: "application/json",
					"content-type": "application/json",
					Authorization: `Bearer ${verifymeAuthToken}`,
				},
			}
		);

		const result = response.data as BvnBooleanVerificationResponse;

		if (!result) {
			throw new ApplicationError("BVN match failed", HttpStatusCodes.BAD_REQUEST);
		}

		return result;
	} catch (error: unknown) {
		throw new ApplicationError("BVN match failed", HttpStatusCodes.BAD_REQUEST);
	}
}

export async function verifyMeAuthToken(clientId: string, secret: string): Promise<string> {
	const url = `${QOREID_URL}/token`;

	try {
		const response = await axios.post(
			url,
			{ clientId, secret },
			{
				headers: {
					accept: "application/json",
					"content-type": "application/json",
				},
			}
		);

		const data = response.data as QoreIDTokenResponse;

		if (!data?.accessToken) {
			throw new ApplicationError("Auth failed", HttpStatusCodes.BAD_REQUEST);
		}

		return data.accessToken;
	} catch (error: unknown) {
		throw new ApplicationError("Auth failed", HttpStatusCodes.BAD_REQUEST);
	}
}
