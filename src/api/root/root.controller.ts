/* eslint-env node */
import { Request, Response, Router } from "express";
import os from "os";
import AppDataSource from "../../config/DataSource";
import logger from "../../config/logger";
import RouteErrorHandler from "../../utils/errorHandler";
const router = Router();
const formatBytesToGB = (bytes: number): string => `${(bytes / 1024 ** 3).toFixed(2)} GB`;
const getSystemStatus = (freeMemoryGB: number, loadAvg: number, cpuCores: number): string => {
	if (freeMemoryGB < 1) return "Warning: Low Memory";
	if (loadAvg > cpuCores) return "Warning: High CPU Load";
	return "Healthy";
};
type DbStatus = "connected" | "disconnected" | "timeout" | "error";

const checkDbHealth = async (): Promise<DbStatus> => {
	if (!AppDataSource.isInitialized) return "disconnected";
	try {
		await AppDataSource.query("SELECT 1");
		return "connected";
	} catch (error) {
		return "error";
	}
};

router.get("/", (_req: Request, res: Response) => {
	logger.info(`🚀 Hello  from the Nodeless Server!`);
	res.status(200).send("🚀 Hello from the Nodeless Server!");
});

router.get(
	"/health",
	RouteErrorHandler(async (_req: Request, res: Response) => {
		const freeMemoryGB = parseFloat(formatBytesToGB(os.freemem()));
		const totalMemoryGB = parseFloat(formatBytesToGB(os.totalmem()));
		const loadAvg = os.loadavg()[0];
		const cpuCores = os.cpus().length;

		const dbStatus = await Promise.race<DbStatus>([
			checkDbHealth(),
			// eslint-disable-next-line no-undef
			new Promise<DbStatus>(resolve => setTimeout(() => resolve("timeout"), 5000)),
		]);

		const systemStatus = getSystemStatus(freeMemoryGB, loadAvg, cpuCores);

		res.status(200).json({
			server: {
				status: systemStatus,
				cpu: {
					model: os.cpus()[0].model,
					cores: cpuCores,
					loadAverage: loadAvg.toFixed(2),
				},
				memory: {
					free: `${freeMemoryGB} GB`,
					total: `${totalMemoryGB} GB`,
					usagePercent: ((1 - freeMemoryGB / totalMemoryGB) * 100).toFixed(1),
				},
				system: {
					architecture: os.arch(),
					platform: os.platform(),
					uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
					hostname: os.hostname(),
				},
			},
			database: {
				status: dbStatus,
			},
		});
	})
);

export default router;
