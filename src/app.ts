import express from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.routes";
import usersRouter from "./modules/users/users.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "SASA backend is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

export default app;