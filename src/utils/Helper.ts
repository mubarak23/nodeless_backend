import {
	FindOptionsOrder,
	FindOptionsSelect,
	FindOptionsWhere,
	ObjectLiteral,
	Repository,
	SelectQueryBuilder,
} from "typeorm";
import { User } from "../api/v1/User/user.entity";
import AppDataSource from "../config/DataSource";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import config from "../config/config";
import path from "path";
import { NigerianState } from "../api/v1/Shared/shared.service";
import { eachDayOfInterval, formatISO, differenceInCalendarDays, isValid } from "date-fns";
import fs from "fs/promises";
import { AdditionalDetails } from "../@types";
import { RequiredFieldForShortletBooking } from "../api/v1/ShortletBooking/interface";
import { Shortlet } from "../api/v1/Shortlet/shortlet.entity";
import { ShortletAvailabilityMode } from "../constants/enum";
import { ShortletBooking } from "../api/v1/ShortletBooking/shortlet-booking.entity";
class Helper {
	private static readonly statesFilePath = path.resolve(__dirname, "..", "api", "v1", "Shared", "./states.json");

	public static async generateUsername(firstName: string, lastName: string, organization: string): Promise<string> {
		const userRepository = AppDataSource.getRepository(User);
		let count = 0;
		let generatedUsername = `${firstName}.${lastName}@${organization}`;

		while (await userRepository.findOne({ where: { username: generatedUsername } })) {
			count++;
			generatedUsername = `${firstName}.${lastName}${count}@${organization}`;
		}

		return generatedUsername;
	}

	static successResponse<T>(res: Response, statusCode: number, message: string, data?: T) {
		return res.status(statusCode).json({
			success: true,
			message,
			...(data && { data }),
		});
	}

	public static generatePropertyReference = async () => {
		const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const lowercase = "abcdefghijklmnopqrstuvwxyz";
		const numbers = "0123456789";

		const allCharacters = uppercase + lowercase + numbers;
		let reference = "";

		for (let i = 0; i < 12; i++) {
			const randomIndex = Math.floor(Math.random() * allCharacters.length);
			reference += allCharacters[randomIndex];
		}

		return reference;
	};
	public static paginate = async <Entity extends ObjectLiteral>(
		repository: Repository<Entity>,
		totalAmount: number,
		filter: FindOptionsWhere<Entity>,
		sort: FindOptionsOrder<Entity>,
		pageSize: number,
		page: number,
		relations: string[] = [],
		select?: (keyof Entity)[]
	) => {
		pageSize = Math.min(pageSize, 50); // Limit pageSize to 50
		const skip = (page - 1) * pageSize;
		const totalPages = Math.ceil(totalAmount / pageSize);

		const [items, count] = await repository.findAndCount({
			where: filter,
			order: sort,
			skip,
			take: pageSize,
			relations,
			select: select as unknown as FindOptionsSelect<Entity>,
		});

		return {
			model: items || [],
			page,
			totalPages: totalPages || 1,
			total: totalAmount,
		};
	};

	public static async paginateQueryBuilder<T extends ObjectLiteral>(
		qb: SelectQueryBuilder<T>,
		pageSize: number,
		page: number
	): Promise<{
		model: T[];
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	}> {
		try {
			const total = await qb.getCount();
			const totalPages = Math.max(1, Math.ceil(total / pageSize)); // always at least 1
			// Adjust page if out of bounds
			const safePage = page > totalPages ? totalPages : page;
			const skip = (safePage - 1) * pageSize;

			const model = await qb.skip(skip).take(pageSize).getMany();

			return {
				model,
				page: safePage,
				pageSize,
				total,
				totalPages,
			};
		} catch (error) {
			console.error("Error in paginateQueryBuilder:", error);
			throw error;
		}
	}

	public static generateUniqueAccessCode = async (): Promise<string> => {
		return Math.floor(100000 + Math.random() * 900000).toString();
	};

	public static generateAccessToken(
		userId: string,
		role: string,
		permissions?: Record<string, boolean>,
		orgId?: string
	): string {
		const payload: Record<string, unknown> = { userId, role, orgId };

		if (permissions) {
			payload.permissions = permissions;
		}

		return jwt.sign(payload, config.JWT.accessToken.secret, {
			expiresIn: config.JWT.accessToken.exp as "15m",
		});
	}

	public static generateRefreshToken(userId: string, role: string): string {
		return jwt.sign({ userId, role }, config.JWT.refreshToken.secret, {
			expiresIn: config.JWT.refreshToken.exp as "1w",
		});
	}
	public static async getStatePercentage(state: NigerianState) {
		const data = await fs.readFile(this.statesFilePath, "utf-8");
		const parsed = JSON.parse(data);
		console.log(parsed[state]);
		return parsed[state];
	}

	public static generateUniqueReference(length: number) {
		const referenceUuid = uuidv4().replace(/-/g, "").slice(0, 13);
		return referenceUuid;
	}

	public static normalizeAdditionalDetails(input?: AdditionalDetails): AdditionalDetails {
		const hasEmergencyContacts =
			input?.emergencyContacts?.some(c => c.name.trim() || c.email.trim() || c.phone_number.trim()) ?? false;

		const hasResidencyDetails =
			input?.residencyDetails?.currentAddress?.trim() ||
			input?.residencyDetails?.previousAddresses?.some(a => a.trim());

		const hasSignatureUrl = input?.signatureUrl?.trim();

		const hasAny = hasEmergencyContacts || hasResidencyDetails || hasSignatureUrl;

		return hasAny
			? {
					emergencyContacts: hasEmergencyContacts ? input?.emergencyContacts : [],
					residencyDetails: hasResidencyDetails
						? {
								currentAddress: input?.residencyDetails?.currentAddress || "",
								previousAddresses: input?.residencyDetails?.previousAddresses || [],
							}
						: {
								currentAddress: "",
								previousAddresses: [],
							},
					signatureUrl: hasSignatureUrl ? input?.signatureUrl : "",
				}
			: {
					emergencyContacts: [],
					residencyDetails: {
						currentAddress: "",
						previousAddresses: [],
					},
					signatureUrl: "",
				};
	}

	public static isValidBookingDuration(
		bookingStartDate: Date | string,
		bookingEndDate: Date | string,
		numberOfDays: number
	): boolean {
		const start = new Date(bookingStartDate);
		const end = new Date(bookingEndDate);

		if (!isValid(start) || !isValid(end)) {
			return false;
		}

		const diffInDays = differenceInCalendarDays(end, start);

		console.log("diffInDays is:", diffInDays);

		if (diffInDays !== numberOfDays) {
			return false;
		}

		return true;
	}

	public static isBookingRangeValid(
		payload: RequiredFieldForShortletBooking,
		shortlet: Shortlet,
		overlappingBookings: ShortletBooking[]
	) {
		const { bookingStartDate, bookingEndDate } = payload;

		// Generate all dates in booking range (inclusive), format as YYYY-MM-DD
		const requestedDates = eachDayOfInterval({
			start: bookingStartDate,
			end: bookingEndDate,
		}).map(date => formatISO(date, { representation: "date" }));

		const invalidDates = new Set<string>();

		shortlet.blockedDays?.forEach((d: string) => invalidDates.add(formatISO(new Date(d), { representation: "date" })));

		if (shortlet.availabilityMode === ShortletAvailabilityMode.DEFAULT_CLOSED) {
			const accepted = shortlet.acceptedDays?.map(d => formatISO(new Date(d), { representation: "date" })) ?? [];

			requestedDates.forEach(d => {
				if (!accepted.includes(d)) {
					invalidDates.add(d);
				}
			});
		}

		overlappingBookings.forEach(booking => {
			const bookedDates = eachDayOfInterval({
				start: booking.bookingStartDate,
				end: booking.bookingEndDate,
			}).map(d => formatISO(d, { representation: "date" }));

			bookedDates.forEach(d => invalidDates.add(d));
		});

		console.log("full invalidDates: ", invalidDates);

		// 4. Final check: if any requested date is in the invalid set
		const conflict = requestedDates.find(d => invalidDates.has(d));

		if (conflict) {
			return false;
			// throw new ConflictError("The date duration is unavailable for booking");
		}

		return true;
	}

	public static calculateTotalAmountMajorForBooking(
  amountPerNightMajor: number | null,
  cautionDepositAmountMajor: number | null,
  numberOfDays: number | null
): number {
  const amountPerNight = amountPerNightMajor ?? 0;
  const cautionDeposit = cautionDepositAmountMajor ?? 0;
  const days = numberOfDays ?? 0;
  const subAmount = amountPerNight * days;

  return Number(subAmount) + Number(cautionDeposit)
}


	//  public static getPaystackTransactionFeeMajor = (amountMajor: number)  {
	//   let possibleTransactionFee = 0.015 * amountMajor;

	//   if (amountMajor >= 2500) {
	//     possibleTransactionFee += 100;
	//   }

	//   return possibleTransactionFee > 2000 ? 2000 : possibleTransactionFee;
	// };
}

export default Helper;
