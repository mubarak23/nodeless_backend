// import passport from "passport";
// import "../strategies/google.strategy";
// import { container } from "tsyringe";
// import UserService from "../api/v1/User/user.service";
// import { User } from "../api/v1/User/user.entity";

// passport.serializeUser((user: Partial<User>, done) => {
// 	done(null, { id: user.id, email: user.email });
// });

// passport.deserializeUser(async (userData: User, done) => {
// 	try {
// 		const userService = container.resolve(UserService);
// 		const user = await userService.findUserByEmail(userData.email);
// 		done(null, user);
// 	} catch (err) {
// 		done(err, null);
// 	}
// });

// export default passport;
