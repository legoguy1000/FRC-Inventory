import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { lookupUserFromOAuth } from "../functions/auth";
import { User } from "@prisma/client";

if (process.env.SITE_URL === undefined || process.env.SITE_URL === '') {
    console.error("SITE_URL environment variable is blank. This will disable all OAuth login");
}

if (process.env.GOOGLE_CLIENT_ID !== undefined && process.env.GOOGLE_CLIENT_ID !== '' && process.env.GOOGLE_CLIENT_SECRET !== undefined && process.env.GOOGLE_CLIENT_SECRET !== '') {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SITE_URL}/auth/callback/google`,
        scope: ['profile'],
        // state: false,
    }, async function verify(accessToken, refreshToken, profile, cb) {
        // console.log(accessToken)
        // console.log(profile)
        let user: User = {
            id: profile.id,
            // fullName: `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`,
            first_name: profile.name?.givenName || "",
            last_name: profile.name?.familyName || "",
            avatar: profile?.photos !== undefined && profile?.photos[0].value || "",
            admin: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        } // await lookupUserFromOAuth(profile.id);
        return cb(null, user);
    }));
} else {
    console.warn("GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET environment variables is not set or is blank. This will disable Google Login")
}

export { passport }
