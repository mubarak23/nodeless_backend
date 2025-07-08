import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import AppDataSource from "../../../config/DataSource";
import { SavedProperty } from "./saved-property.entity";
import { Property } from "../Property/property.entity";
import { User } from "../User/user.entity";

@injectable()
class SavedPropertyRepository {
	private savedPropertyRepo: Repository<SavedProperty>;
	private userRepo: Repository<User>;
	private propertyRepo: Repository<Property>;

	constructor() {
		this.savedPropertyRepo = AppDataSource.getRepository(SavedProperty);
		this.userRepo = AppDataSource.getRepository(User);
		this.propertyRepo = AppDataSource.getRepository(Property);
	}

	async create(savedPropertyDto: Partial<SavedProperty>): Promise<SavedProperty> {
		const user = await this.userRepo.findOneByOrFail({ id: savedPropertyDto.user?.id });
		const property = await this.propertyRepo.findOneByOrFail({ id: savedPropertyDto.property?.id });

		const savedProperty = this.savedPropertyRepo.create({ user, property });
		return await this.savedPropertyRepo.save(savedProperty);
	}

	async getAllByUserId(userId: string): Promise<SavedProperty[]> {
		return await this.savedPropertyRepo.find({
			where: { user: { id: userId } },
			relations: ["property"],
			order: { createdAt: "DESC" },
		});
	}

	async getByPropertyId(propertyId: string): Promise<SavedProperty[]> {
		return await this.savedPropertyRepo.find({
			where: { property: { id: propertyId } },
			relations: ["user"],
			order: { createdAt: "DESC" },
		});
	}

	async delete(savedPropertyId: string): Promise<void> {
		await this.savedPropertyRepo.delete(savedPropertyId);
	}
}

export default SavedPropertyRepository;
