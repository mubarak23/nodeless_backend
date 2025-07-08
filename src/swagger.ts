import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "./config/config";
import logger from "./config/logger";

const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "API documentation for Reala Backend",
		version: "1.0.0",
		description: "This is the API documentation for Reala Backend",
	},
	servers: [
		{
			url: `http://localhost:${config.port}`,
			description: "Reala server Web Backend",
		},
	],
};

const options = {
	swaggerDefinition,
	apis: ["src/api/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Application) {
	const port = config.port;
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	logger.info(`📃 Swagger Docs available at http://localhost:${port}/api-docs`);
}
