import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import BreezService from '../../../config/breez';
import HttpStatusCodes from "../../../constants/HttpStatusCodes";
import Helper from "../../../utils/Helper";
const { successResponse } = Helper;

@autoInjectable()
export default class LnController {
	constructor() {}
  public async getHealth(req: Request, res: Response) {
		const checkHealth = await BreezService.getHealth();
		return successResponse(res, HttpStatusCodes.OK, "Health check for breez SDK", checkHealth);
	}


  public async signMessage(req: Request, res: Response) {
      const { message } = req.body;
		const signMessage = await BreezService.signMessage(message);
		return successResponse(res, HttpStatusCodes.OK, "Sign Message", signMessage);
	}

  public async verifyMessage(req: Request, res: Response) {
      const { message, pubkey, signature } = req.body;
		const verifyMessage = await BreezService.verifySignature(message, pubkey, signature);
		return successResponse(res, HttpStatusCodes.OK, "Verify Message", verifyMessage);
	}

  




}
