import { User } from "../../api/v1/User/user.entity";
import { Request } from "express";
declare global {
	declare namespace Express {
		export interface Request {
			user?: User;
		}
	}
}

export {};
