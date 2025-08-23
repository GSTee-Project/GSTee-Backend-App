import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";

// Importing routes
import slideRoutes from "./routes/slideRoutes.js";
import lessonProgressRoutes from "./routes/lessonProgressRoutes.js";
import heartRoutes from "./routes/heartRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import gameSessionRoutes from "./routes/gameSessionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import userBadgeRoutes from "./routes/userBadgeRoutes.js";

import { authMiddleware } from "./middlewares/middleware.js";
import "./config/passport.js"; // initialize strategy

dotenv.config();
const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:4000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
    // ❌ DO NOT use force:true in prod
    // ❌ DO NOT use alter:true in prod (unless testing)
    // ✅ Instead rely on migrations

    sequelize.sync({ force: false }); // Sync models with the database
  })
  .catch((err) => console.error("Unable to connect to the database:", err));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/auth", authRoutes);
// Protected (require login)
app.use("/api", authMiddleware, slideRoutes);
app.use("/api", authMiddleware, lessonProgressRoutes);
app.use("/api", authMiddleware, heartRoutes);
app.use("/api", authMiddleware, gameRoutes);
app.use("/api", authMiddleware, gameSessionRoutes);
app.use("/api", authMiddleware, questionRoutes);
app.use("/api", authMiddleware, badgeRoutes);
app.use("/api", authMiddleware, userBadgeRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not exists!" }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
