"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = require("mssql");
exports.error = async (db, props) => {
    try {
        await db
            .request()
            .input('applicationID', mssql_1.Int, props.applicationID)
            .input('logLevelID', mssql_1.Int, props.logLevelID)
            .input('userID', mssql_1.Int, props.userID)
            .input('errorID', mssql_1.Int, props.errorID)
            .input('methodID', mssql_1.Int, props.methodID)
            .input('routeID', mssql_1.Int, props.routeID).query(`
    INSERT INTO dbo.Log (ApplicationID, LogLevelID, UserID, ErrorID, MethodID, RouteID)
    VALUES (@applicationID, @logLevelID, @userID, @errorID, @methodID, @routeID);`);
    }
    catch (error) {
        throw error;
    }
};
exports.logLevel = async (db, logLevel) => {
    try {
        const result = await db
            .request()
            .input('logLevel', mssql_1.NVarChar(20), logLevel)
            .output('logLevelID', mssql_1.Int).query(`
      IF ((SELECT COUNT(LogLevelID) FROM dbo.LogLevel WHERE Level = @logLevel) > 0)
          SELECT LogLevelID as logLevelID FROM dbo.LogLevel WHERE Level = @logLevel
      ELSE 
          INSERT INTO dbo.LogLevel (LogLevel) 
          OUTPUT INSERTED.logLevelID
          VALUES (@logLevel)
      `);
        return result.recordsets[0][0].levelID;
    }
    catch (error) {
        throw error;
    }
};
