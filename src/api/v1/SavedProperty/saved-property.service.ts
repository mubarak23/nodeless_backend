// import { autoInjectable } from "tsyringe";
// import SavedPropertyRepository from "./saved-property.repository";
// import PropertyRepository from "../Property/property.repository";
// import UserRepository from "../User/user.repository";
// import { ConflictError, NotFoundError, InternalServerError } from "../../../utils/errorHandler";
// import HttpStatusCodes from "../../../constants/HttpStatusCodes";
// import ActivityLogsRepository from "../ActivityLogs/activity-logs.repository";

// @autoInjectable()
// export class SavedPropertyService {
// 	constructor(
// 		private savedPropertyRepository: SavedPropertyRepository,
// 		private userRepository: UserRepository,
// 		private propertyRepository: PropertyRepository,
// 		private activityLogsRepo: ActivityLogsRepository
// 	) {}

// 	async saveProperty(userId: string, propertyId: string) {
// 		const [user, property] = await Promise.all([
// 			this.userRepository.findById(userId),
// 			this.propertyRepository.findPropertyById(propertyId),
// 		]);

// 		if (!user || !property) {
// 			throw new NotFoundError("User or property not found.", HttpStatusCodes.NOT_FOUND);
// 		}

// 		const existingSaves = await this.savedPropertyRepository.getByPropertyId(propertyId);
// 		const alreadySaved = existingSaves.find(s => s.user.id === userId);

// 		if (alreadySaved) {
// 			throw new ConflictError("Property already saved by this user.");
// 		}

// 		const savedProperty = await this.savedPropertyRepository.create({ user, property });

// 		this.activityLogsRepo.createLog({
// 			title: "Property Saved",
// 			message: `Property ${savedProperty.property.address} saved by ${user.firstName} .`,
// 			metadata: {
// 				savedProperty,
// 			},
// 			organization: savedProperty?.property.orgId,
// 			user: savedProperty?.property.managingAgent,
// 		});

// 		return savedProperty;
// 	}

// 	async getSavedPropertiesByUser(userId: string) {
// 		return await this.savedPropertyRepository.getAllByUserId(userId);
// 	}

// 	async getUsersWhoSavedProperty(propertyId: string) {
// 		return await this.savedPropertyRepository.getByPropertyId(propertyId);
// 	}

// 	async deleteSavedProperty(savedPropertyId: string, userId: string) {
// 		const savedProperties = await this.savedPropertyRepository.getAllByUserId(userId);
// 		const targetSave = savedProperties.find(s => s.id === savedPropertyId);

// 		if (!targetSave) {
// 			throw new NotFoundError("Saved property not found or doesn't belong to the user.", HttpStatusCodes.NOT_FOUND);
// 		}

// 		await this.savedPropertyRepository.delete(savedPropertyId);

// 		return { message: "Saved property removed successfully." };
// 	}
// }
