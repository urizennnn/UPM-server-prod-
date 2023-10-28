"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const connect_1 = require("./db/connect");
const user_1 = __importDefault(require("./routes/user"));
const password_1 = __importDefault(require("./routes/password"));
const returnerror_1 = require("./middleware/returnerror");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Middleware
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
// Routes
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/password", password_1.default);
// Error Handling Middleware
app.use(returnerror_1.errorHandler);
(async () => {
    try {
        const connectionString = process.env.CONNECTION_STRING || undefined;
        await (0, connect_1.connectDB)(connectionString);
        console.log("Connected to the database");
        const server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
        process.on("SIGINT", () => {
            console.log("Shutting down...");
            server.close(() => {
                console.log("Server closed.");
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error("Something went wrong:", error);
        process.exit(1); // Terminate the process on error
    }
})();
