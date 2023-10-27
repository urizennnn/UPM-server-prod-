"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis = __importStar(require("redis"));
const retry_1 = __importDefault(require("retry")); // Import the 'retry' module
async function connectRedis() {
    const operation = retry_1.default.operation({
        retries: 5,
        factor: 2,
    });
    return new Promise((resolve, reject) => {
        operation.attempt(async (currentAttempt) => {
            const client = redis.createClient({
                password: "zmXQIrfLF1iFANq2pBwlEsr4QSLaJCtb",
                socket: {
                    host: "redis-17103.c90.us-east-1-3.ec2.cloud.redislabs.com",
                    port: 17103,
                },
            });
            client.on("error", (err) => {
                console.error("Redis Client Error", err);
                if (operation.retry(err)) {
                    console.log(`Retrying connection (attempt ${currentAttempt + 1})...`);
                    client.quit();
                }
                else {
                    console.error('Connection attempts exhausted. Unable to connect to Redis.');
                    reject(err);
                }
            });
            client.on("connect", () => {
                console.log("Connected to Redis server");
                resolve(client);
            });
        });
    });
}
exports.connectRedis = connectRedis;
