/* eslint-env node */
import dotenv from "dotenv";
dotenv.config();
const environment = process.env.NODE_ENV || "development";
const isDev = environment === "development";
//const getMongoUri = () => process.env[`${environment.toUpperCase().trim()}_MONGO_URI`];

export const config = {
	port: (process.env.PORT ? Number(process.env.PORT) : 3000) as number,
	NODE_ENV: environment,
	JWT: {
		accessToken: {
			secret: process.env.ACCESS_TOKEN_SECRET ?? "",
			exp: process.env.ACCESS_TOKEN_EXP ?? "30m",
		},
		refreshToken: {
			secret: process.env.REFRESH_TOKEN_SECRET ?? "",
			exp: process.env.REFRESH_TOKEN_EXP ?? "1w",
		},
	},

	db: {
		postgres: {
			port: (process.env.POSTRES_PORT ? Number(process.env.POSTRES_PORT) : 5432) as number,
			host: process.env.POSTGRES_HOST || "localhost",
			username: process.env.POSTGRES_USERNAME || "postgres",
			password: process.env.POSTGRES_PASSWORD || "350335",
			database: process.env.POSTGRES_DB_NAME || "nodeless",
		},
		redis: {
			port: Number(process.env.REDIS_PORT) || 6379,
			host: process.env.REDIS_HOST || "localhost",
			password: process.env.REDIS_PASSWORD || undefined,
		},
		// mongo_uri: getMongoUri() || "mongodb://localhost:27017/testdb",
	},
	breez: {
	 breez_api_api: process.env.BREEZ_API_KEY || '7D0K08N4TjSpWYIau86iIQ.iYWcFP4uXQ2ZppuRJ3t7Gp0HnADQRET44O37YIbJo-Q',
	 breez_mnemonic : process.env.BREEZ_MNEMONIC || '12, 15, 18, 21, 12, 15, 18, 21, 12, 15, 18, 21,'
	},
	clientBaseUrl: process.env.CLIENT_BASE_URL?.trim() || "http://localhost:3000",
	defaultSplitPercentage: Number(process.env.DEFAULT_SPLIT_PERCENTAGE),
	platformCharges: Number(process.env.PLATFORM_CHARGES),
};

//template by solomonsolomonsolomon
export { isDev };
export default config;
