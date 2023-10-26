"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showPasswords = exports.DeletePassword = exports.createPassword = void 0;
const custom_error_1 = __importDefault(require("../error/custom-error"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt = __importStar(require("bcrypt"));
async function createpasswordEntry(req, res) {
    try {
        const { email, name, password } = req.body;
        const existingUser = await user_1.default.findOne({ email });
        if (!existingUser) {
            throw new custom_error_1.default("User does not exist. Please create a user with this email and try again.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const existingManager = await password_1.default.findOne({ email });
        if (existingManager) {
            throw new custom_error_1.default("Password manager already exists for this user. Proceed to update.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const newInput = {
            email: email,
            passManager: {
                siteName: name,
                sitePassword: password
            }
        };
        const createdManager = await password_1.default.create(newInput);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(createdManager);
    }
    catch (error) { }
}
exports.createPassword = createPassword;
async function DeletePassword(req, res) {
    try {
        const { email, name, password } = req.body;
        const exists = await password_1.default.findOne({ email });
        const exist = await user_1.default.findOne({ email });
        if (!exist) {
            throw new custom_error_1.default("User does not exist please create an account and try again", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        if (!exists) {
            throw new custom_error_1.default("'Please create a User or check the URL address and try again'", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const updatedUser = await password_1.default.findOneAndUpdate({ email }, { $set: { [`passManager.${name}`]: password } }, { upsert: true, new: true });
        await exists.save();
        return res.status(201).json({ name, password });
    }
    catch (error) {
        throw new custom_error_1.default(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.addPassword = addPassword;
async function deletePassword(req, res) {
    try {
        const { email, name, password } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            throw new custom_error_1.default("User not found", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new custom_error_1.default("Invalid password", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const manager = await password_1.default.findOne({ email });
        if (!manager) {
            throw new custom_error_1.default("No Passwords to delete", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const pass = manager.passManager;
        for (const [key, value] of Object.entries(pass)) {
            if (key === name) {
                delete pass[key];
                await manager.save();
            }
        }
    }
    catch (error) {
        throw new custom_error_1.default(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.deletePassword = deletePassword;
async function showPassword(req, res) {
    try {
        const { email } = req.body;
        const exist = await password_1.default.findOne({ email });
        if (!exist) {
            throw new custom_error_1.default('No Passwords to Show', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json(exist);
    }
    catch (err) {
        throw new custom_error_1.default(err.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.showPasswords = showPasswords;
