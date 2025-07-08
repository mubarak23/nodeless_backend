import { NextFunction, Request, Response } from "express";
import { AuthProvider, Roles } from "../constants/enum";
import AuthService from "../api/v1/Auth/auth.service";
import { container } from "tsyringe";
import UserService from "../api/v1/User/user.service";

const roleGuard = (roles: string[], permissions: string[] = []) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as {
			userId: string;
			role: string;
			permissions?: Record<string, boolean>;
		};

		const userService = container.resolve(UserService);
		const allowedRoles = new Set(roles.map(role => role.toLocaleLowerCase()));
		const userRole = user.role.toLocaleLowerCase();
		const userAuth = await userService.findUserById(user.userId);
		const userAuthProvider = userAuth!.authProvider;
		// Skip "canManageProperty" check for GOOGLE users not having AGENT or PROPERTY_MANAGER role
		if (
			userAuthProvider === AuthProvider.GOOGLE &&
			!["agent", "property_manager"].includes(userRole) &&
			permissions.includes("canManageProperty")
		) {
			return next();
		}

		if (!user || !user.role) {
			return res.status(403).json({ message: "Unauthorized: No role found" });
		}

		if (!allowedRoles.has(userRole)) {
			return res.status(403).json({ message: "Forbidden: Insufficient role" });
		}

		// Bypass permission check if role is PROPERTY_MANAGER
		if (userRole === Roles.PROPERTY_MANAGER.toLocaleLowerCase()) {
			return next();
		}

		if (permissions.length > 0) {
			const userPermissions = user.permissions || {};

			const hasAllPermissions = permissions.every(perm => userPermissions[perm] === true);

			if (!hasAllPermissions) {
				return res.status(403).json({
					message: "Forbidden: Missing required permissions",
				});
			}
		}

		next();
	};
};

export default roleGuard;
