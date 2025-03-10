import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

/* ✅ Configure Google OAuth Strategy */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails?.[0]?.value || "";

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email, // ✅ Use email only if available
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);


/* ✅ Configure GitHub OAuth Strategy */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Fetch emails from GitHub API if not provided
        let email = profile.emails?.[0]?.value || "";

        if (!email) {
          const emailResponse = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const emails = await emailResponse.json();
          email = emails.find((e) => e.primary && e.verified)?.email || "";
        }

        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = new User({
            githubId: profile.id,
            name: profile.username,
            email, // ✅ Use email only if available
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);


export default passport;
