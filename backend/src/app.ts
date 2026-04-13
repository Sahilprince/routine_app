import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter } from "./modules/auth/auth.routes";
import { routinesRouter } from "./modules/routines/routines.routes";
import { completionsRouter } from "./modules/completions/completions.routes";
import { penaltiesRouter } from "./modules/penalties/penalties.routes";
import { couplesRouter } from "./modules/couples/couples.routes";
import { analyticsRouter } from "./modules/analytics/analytics.routes";
import { aiRouter } from "./modules/ai/ai.routes";
import { exportRouter } from "./modules/export/export.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/routines", routinesRouter);
app.use("/api/tracking", completionsRouter);
app.use("/api/penalties", penaltiesRouter);
app.use("/api/couples", couplesRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/export", exportRouter);

app.use(errorHandler);

export default app;
