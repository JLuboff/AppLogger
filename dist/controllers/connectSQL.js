"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = require("mssql");
exports.initializeDBConnection = async (sqlConfig) => {
    try {
        const pool = new mssql_1.ConnectionPool(sqlConfig);
        await pool.connect();
        return pool;
    }
    catch (err) {
        err.function = err.function
            ? ['connectSQL.initializeDBConnection()', ...err.function]
            : ['connectSQL.initializeDBConnection()'];
        throw err;
    }
};
