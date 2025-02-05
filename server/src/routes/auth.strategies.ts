import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github"
import passport from "passport";
import { lookupUserFromOAuth, generateInitialAdmin, updateUserFromOAuth } from "../functions/auth";
import { User } from "@prisma/client";

if (process.env.SITE_URL === undefined || process.env.SITE_URL === '') {
    console.error("SITE_URL environment variable is blank. This will disable all OAuth login");
}

if (process.env.GOOGLE_CLIENT_ID !== undefined && process.env.GOOGLE_CLIENT_ID !== '' && process.env.GOOGLE_CLIENT_SECRET !== undefined && process.env.GOOGLE_CLIENT_SECRET !== '') {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SITE_URL}/auth/callback/google`,
        scope: ['profile', 'email'],
    }, async function verify(accessToken, refreshToken, profile, cb) {
        if (profile?._json.email === undefined) {
            return cb(null, false, { message: "No email address associated with Google Account" });
        }
        if (profile?._json.email_verified === undefined) {
            return cb(null, false, { message: "No verified email address associated with Google Account. Only verified emails are allowed to be used." });
        }
        const profileEmail = profile?._json.email;
        let profileData = {
            name: `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`,
            email: profileEmail,
            avatar: profile?.photos !== undefined && profile?.photos[0].value || "",
        }
        await generateInitialAdmin(profileData);
        let { error, user, message }: { error: boolean, user: User | null, message: string } = await lookupUserFromOAuth(profileEmail);
        if (error || user === null) {
            return cb(null, false, { message: message });
        }
        user = await updateUserFromOAuth(user.id, profileData);
        return cb(null, user as User, { message: message });
    }));
} else {
    console.warn("GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET environment variables is not set or is blank. This will disable Google Login")
}

if (process.env.GITHUB_CLIENT_ID !== undefined && process.env.GITHUB_CLIENT_ID !== '' && process.env.GITHUB_CLIENT_SECRET !== undefined && process.env.GITHUB_CLIENT_SECRET !== '') {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.SITE_URL}/auth/callback/github`,
        scope: ["read:user", "user:email"]
    }, async function verify(accessToken, refreshToken, profile, cb) {
        const githubProfile: any = profile?._json
        if (githubProfile.email === undefined) {
            return cb(null, false, { message: "No email address associated with Github Account" });
        }
        // if (profile?._json.email_verified === undefined) {
        //     return cb(null, false, { message: "No verified email address associated with Google Account. Only verified emails are allowed to be used." });
        // }
        let profileData = {
            name: githubProfile?.name || "",
            email: githubProfile.email,
            avatar: githubProfile?.avatar_url || "",
        }
        await generateInitialAdmin(profileData);
        let { error, user, message }: { error: boolean, user: User | null, message: string } = await lookupUserFromOAuth(githubProfile.email);
        if (error || user === null) {
            return cb(null, false, { message: message });
        }
        user = await updateUserFromOAuth(user.id, profileData);
        return cb(null, user as User, { message: message });
    }));
} else {
    console.warn("GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET environment variables is not set or is blank. This will disable Google Login")
}

export { passport }
