"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const entries_1 = __importDefault(require("./routes/entries"));
const insights_1 = __importDefault(require("./routes/insights"));
const auth_2 = require("./middleware/auth");
const app = (0, express_1.default)();
const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
]);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow non-browser tools and same-machine local apps.
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/entries', auth_2.authMiddleWare, entries_1.default);
app.use('/api/insights', auth_2.authMiddleWare, insights_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timeStamp: new Date().toISOString() });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});
exports.default = app;
