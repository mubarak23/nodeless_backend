// import { NextFunction, Request, Response } from "express";
// import { container } from "tsyringe";

// import AuthService from "../api/v1/Auth/auth.service";
// import HttpStatusCodes from "../constants/HttpStatusCodes";
// import { ApplicationError } from "../utils/errorHandler";

// export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const accessToken = req.headers.authorization?.split(" ")[1];
// 		const refreshToken = req.headers["refresh-token"] as string;

// 		if (!accessToken) {
// 			throw new ApplicationError("No access token provided", HttpStatusCodes.UNAUTHORIZED);
// 		}

// 		const authService = container.resolve(AuthService);
// 		try {
// 			const decoded = await authService.verifyAccessToken(accessToken);
// 			req.user = decoded as { userId: string; role: string; iat: number; exp: number; permission: string; orgId: string; };
// 			next();
// 		} catch (error: unknown) {
// 			console.log("error", error);

// 			if (error instanceof Error && error.name === "TokenExpiredError") {
// 				if (!refreshToken) {
// 					throw new ApplicationError("Token expired and missing refresh credentials", HttpStatusCodes.UNAUTHORIZED);
// 				}
// 				next();
// 			} else {
// 				throw new ApplicationError("Invalid token", HttpStatusCodes.UNAUTHORIZED);
// 			}
// 		}
// 	} catch (error) {
// 		next(error);
// 	}
// };
