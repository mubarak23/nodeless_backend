import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request } from "express";
import AuthService from "../api/v1/Auth/auth.service";
import { container } from "tsyringe";
interface GoogleProfile {
	emails: {
		value: string;
	}[];
	name: {
		givenName?: string;
		familyName?: string;
	};
}
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: process.env.GOOGLE_CALLBACK_URL!,
			passReqToCallback: true,
			scope: ["profile", "email"],
		},
		async (req: Request, accessToken: string, refreshToken: string, profile, done) => {
			try {
				const email = profile.emails?.[0]?.value;
				if (!email) return done(new Error("No email found"), undefined);

				const authService = container.resolve(AuthService);

				const user = await authService.validateUserWithGoogle(profile as GoogleProfile);
				return done(null, user);
			} catch (err) {
				return done(err, undefined);
			}
		}
	)
);
