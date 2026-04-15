import express from "express";
import cors from "cors";
import path from "path";
import authRouter from "./modules/auth/auth.routes";
import usersRouter from "./modules/users/users.routes";
import universitiesRouter from "./modules/universities/universities.routes";
import uploadRouter from "./modules/upload/upload.routes";
import teamsRouter from "./modules/teams/teams.routes";
import tournamentsRouter from "./modules/tournaments/tournaments.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "SASA backend is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/universities", universitiesRouter);
app.use("/api/upload", uploadRouter);
app.use("/api", teamsRouter);
app.use("/api", tournamentsRouter);

export default app;