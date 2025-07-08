// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { User } from "../User/user.entity";
// import { Property } from "../Property/property.entity";

// @Entity()
// export class SavedProperty {
// 	@PrimaryGeneratedColumn("uuid")
// 	id!: string;

// 	@ManyToOne(() => User, user => user.id)
// 	user!: User;

// 	@ManyToOne(() => Property, property => property.id)
// 	property!: Property;

// 	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
// 	createdAt!: Date;

// 	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
// 	updatedAt!: Date;
// }
