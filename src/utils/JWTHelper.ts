import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { ApplicationError } from "./errorHandler";

const accessTokenSecret = config.JWT.accessToken.secret;
const refreshTokenSecret = config.JWT.refreshToken.secret;

class JwtHelper {
	public constructor() {}

	public verifyAccessToken(token: string) {
		try {
			return jwt.verify(token, accessTokenSecret);
		} catch (error) {
			throw new ApplicationError("Invalid Token", HttpStatusCodes.UNAUTHORIZED);
		}
	}

	public verifyRefreshToken(token: string) {
		try {
			const decoded = jwt.verify(token, refreshTokenSecret) as JwtPayload;

			if (!decoded.userId) {
				throw new ApplicationError("Invalid Token", HttpStatusCodes.UNAUTHORIZED);
			}

			return decoded.userId;
		} catch (error) {
			throw new ApplicationError("Invalid Token", HttpStatusCodes.UNAUTHORIZED);
		}
	}
}

export default JwtHelper;
