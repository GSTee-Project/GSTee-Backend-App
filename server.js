import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";

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

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);

//Sync database
sequelize.sync().then(() => console.log("Database connected"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
