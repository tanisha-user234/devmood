"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insightsController_1 = require("../controllers/insightsController");
const insightsRouter = (0, express_1.Router)();
insightsRouter.get("/", insightsController_1.getInsights);
exports.default = insightsRouter;
