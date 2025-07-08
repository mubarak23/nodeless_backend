import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

interface ValidationSchemas {
	body?: ObjectSchema;
	params?: ObjectSchema;
	query?: ObjectSchema;
}

const validate = (schemas: ValidationSchemas) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const validationTargets: { source: keyof ValidationSchemas }[] = [
			{ source: "body" },
			{ source: "params" },
			{ source: "query" },
		];

		for (const { source } of validationTargets) {
			const schema = schemas[source];
			if (schema) {
				const { error } = schema.validate(req[source], { abortEarly: false });
				if (error) {
					const messages = error.details.map(d => d.message);
					return res.status(400).json({ errors: messages, source });
				}
			}
		}

		next();
	};
};

export default validate;
