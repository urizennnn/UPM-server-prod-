"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = __importDefault(require("../error/custom-error"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof custom_error_1.default) {
        return res.status(err.StatusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
};
exports.errorHandler = errorHandler;
