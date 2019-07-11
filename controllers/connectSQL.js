"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = __importDefault(require("mssql"));
exports.initializeDBConnection = async (sqlConfig) => {
    try {
        const pool = new mssql_1.default.ConnectionPool(sqlConfig);
        const poolConnected = pool.connect();
        await poolConnected;
        return pool;
    }
    catch (err) {
        err.function = err.function
            ? ['connectSQL.initializeDBConnection()', ...err.function]
            : ['connectSQL.initializeDBConnection()'];
        throw err;
    }
};
