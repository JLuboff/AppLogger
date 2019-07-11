"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = __importDefault(require("mssql"));
exports.error = async (db, props) => {
    try {
        await db
            .request()
            .input('applicationID', mssql_1.default.Int, props.applicationID)
            .input('levelID', mssql_1.default.Int, props.levelID)
            .input('userID', mssql_1.default.Int, props.userID)
            .input('errorID', mssql_1.default.Int, props.errorID)
            .input('methodID', mssql_1.default.Int, props.methodID)
            .input('routeID', mssql_1.default.Int, props.routeID).query(`
    INSERT INTO dbo.Log (ApplicationID, LevelID, UserID, ErrorID, MethodID, RouteID)
    VALUES (@applicationID, @levelID, @userID, @errorID, @methodID, @routeID);`);
    }
    catch (error) {
        throw error;
    }
};
