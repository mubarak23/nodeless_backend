// middlewares/rawBody.ts or a separate types file like types/express.d.ts

import { Request, Response } from "express";
import bodyParser, { OptionsJson } from "body-parser";

// ✅ Module augmentation for Express
// declare module "express" {
//   interface Request {
//     rawBody?: string;
//   }
// }

// ✅ Middleware with raw body capture
// export const jsonWithRawBody = bodyParser.json({
//   verify: (req: Request, res: Response, buf: Buffer) => {
//     req.rawBody = buf.toString("utf8");
//     console.log("req.rawBody is:", req.rawBody);
//   },
// } as OptionsJson);

export const jsonWithRawBody = bodyParser.json({
	verify: (req: Request & { rawBody?: string }, _res: Response, buf: Buffer) => {
		req.rawBody = buf.toString();
	},
});
