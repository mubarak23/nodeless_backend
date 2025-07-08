// import { Request, Response } from "express";
// import { autoInjectable } from "tsyringe";
// import { SavedPropertyService } from "./saved-property.service";
// import Helper from "../../../utils/Helper";
// import HttpStatusCodes from "../../../constants/HttpStatusCodes";
// import { ValidationError } from "../../../utils/errorHandler";

// const { successResponse } = Helper;

// @autoInjectable()
// export default class SavedPropertyController {
// 	constructor(private savedPropertyService: SavedPropertyService) {}

// 	public async saveProperty(req: Request, res: Response) {
// 		const userId = (req.user as { userId: string }).userId;
// 		const { propertyId } = req.body;

// 		if (!propertyId) {
// 			throw new ValidationError("propertyId is required");
// 		}

// 		const saved = await this.savedPropertyService.saveProperty(userId, propertyId);
// 		return successResponse(res, HttpStatusCodes.CREATED, "Property saved successfully", saved);
// 	}

// 	public async getSavedProperties(req: Request, res: Response) {
// 		const userId = (req.user as { userId: string }).userId;

// 		const properties = await this.savedPropertyService.getSavedPropertiesByUser(userId);
// 		return successResponse(res, HttpStatusCodes.OK, "Saved properties retrieved successfully", properties);
// 	}

// 	public async getUsersWhoSavedProperty(req: Request, res: Response) {
// 		const { propertyId } = req.params;

// 		if (!propertyId) {
// 			throw new ValidationError("propertyId is required in the URL");
// 		}

// 		const users = await this.savedPropertyService.getUsersWhoSavedProperty(propertyId);
// 		return successResponse(res, HttpStatusCodes.OK, "Users who saved the property retrieved successfully", users);
// 	}

// 	public async deleteSavedProperty(req: Request, res: Response) {
// 		const userId = (req.user as { userId: string }).userId;
// 		const { savedPropertyId } = req.params;

// 		if (!savedPropertyId) {
// 			throw new ValidationError("savedPropertyId is required in the URL");
// 		}

// 		const result = await this.savedPropertyService.deleteSavedProperty(savedPropertyId, userId);
// 		return successResponse(res, HttpStatusCodes.OK, result.message);
// 	}
// }
