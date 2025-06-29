import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// Importing routes
import userRoutes from "./routes/userRoutes.js";
import slideRoutes from "./routes/slideRoutes.js";
import lessonProgressRoutes from "./routes/lessonProgressRoutes.js";
import heartRoutes from "./routes/heartRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import gameSessionRoutes from "./routes/gameSessionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import userBadgeRoutes from "./routes/userBadgeRoutes.js";

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
    sequelize.sync({ alter: true }); // Sync models with the database
  })
  .catch((err) => console.error("Unable to connect to the database:", err));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", slideRoutes);
app.use("/api", lessonProgressRoutes);
app.use("/api", heartRoutes);
app.use("/api", gameRoutes);
app.use("/api", gameSessionRoutes);
app.use("/api", questionRoutes);
app.use("/api", badgeRoutes);
app.use("/api", userBadgeRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not exists!" }));

//Sync database
sequelize.sync().then(() => console.log("Database connected"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
