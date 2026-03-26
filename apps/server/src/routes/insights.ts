import { Router } from "express";
import { getInsights } from "../controllers/insightsController";

const insightsRouter = Router();

insightsRouter.get("/", getInsights);

export default insightsRouter;
