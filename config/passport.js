import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./database.js";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // for generating random passwords

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Check if user already exists
        let user = await User.findOne({ where: { email } });

        if (!user) {
          // Create user with a random password (or make password nullable in model)
          user = await User.create({
            email,
            name: profile.displayName || "No Name",
            password: crypto.randomBytes(16).toString("hex"), // random safe password
            isVerified: true, // Google email is trusted
          });
        }

        // Issue JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // Pass user + token to next middleware
        return done(null, { user, token });
      } catch (err) {
        console.error("OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

// Optional: serialize / deserialize (if using sessions)
passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

export default passport;
