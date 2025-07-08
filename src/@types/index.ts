import { Request } from "express";
export interface AuthenticatedRequest extends Request {
	user?: {
		userId: string;
	};
}

export type AdditionalDetails = {
	emergencyContacts?: {
		name: string;
		email: string;
		phone_number: string;
	}[];
	residencyDetails?: {
		currentAddress: string;
		previousAddresses?: string[];
	};
	signatureUrl?: string,
};

export type Guarantor = {
	name: string;
	phoneNumber: string;
	email: string;
};
