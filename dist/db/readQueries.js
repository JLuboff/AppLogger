"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = require("mssql");
exports.applicationID = async (db, appName) => {
    try {
        const result = await db.request().input('appName', mssql_1.NVarChar(50), appName)
            .query(`
    IF ((SELECT COUNT(ApplicationID) FROM dbo.Application WHERE Application = @appName) >= 1)
      SELECT ApplicationID 
        FROM dbo.Application 
        WHERE Application = @appName
    ELSE 
      INSERT INTO dbo.Application(Application)
        OUTPUT INSERTED.ApplicationID
      VALUES (@appName)
    `);
        return result.recordsets[0][0].ApplicationID;
    }
    catch (error) {
        throw error;
    }
};
exports.errorID = async (db, message, type) => {
    try {
        const result = await db
            .request()
            .input('message', mssql_1.NVarChar(mssql_1.MAX), message)
            .input('type', mssql_1.NVarChar(mssql_1.MAX), type).query(`
            IF ((SELECT COUNT(ErrorID) 
              FROM dbo.Error 
              WHERE ErrorMessage = @message AND ErrorType ${type === undefined ? 'IS NULL' : '= @type'}) >= 1)
                SELECT ErrorID
                FROM dbo.Error 
                WHERE ErrorMessage = @message AND ErrorType ${type === undefined ? 'IS NULL' : '= @type'}
            ELSE 
              INSERT INTO dbo.Error(ErrorMessage, ErrorType)
                OUTPUT INSERTED.ErrorID
              VALUES (@message, @type)`);
        return result.recordsets[0][0].ErrorID;
    }
    catch (error) {
        throw `errorID ${error}`;
    }
};
exports.errors = async (db) => {
    try {
        const result = await db.request().query(`
            SELECT l.LogID AS logID, a.Application AS application, ll.LogLevel AS logLevel,
             e.ErrorMessage AS errorMessage, e.ErrorType AS errorType, u.[User] AS 'user', 
             m.Method AS 'function', r.Route AS route, r.Method AS routeMethod, 
             l.TimeOccured As logTime
            FROM dbo.Log l 
              INNER JOIN dbo.Application AS a 
                ON l.ApplicationID = a.ApplicationID
              INNER JOIN dbo.LogLevel AS ll 
                ON l.LogLevelID = ll.LogLevelID
              LEFT JOIN dbo.Error AS e 
                ON l.ErrorID = e.ErrorID
              LEFT JOIN dbo.[User] AS u
                ON l.UserID = u.UserID
              LEFT JOIN dbo.Method AS m
                ON l.MethodID = m.MethodID
              LEFT JOIN dbo.Route AS r 
                ON l.RouteID = r.RouteID`);
        return result.recordsets[0];
    }
    catch (error) {
        throw error;
    }
};
exports.functionID = async (db, method) => {
    try {
        const result = await db.request().input('method', mssql_1.NVarChar(mssql_1.MAX), method)
            .query(`
    IF ((SELECT COUNT(MethodID) FROM dbo.Method WHERE Method = @method) >= 1)
      SELECT MethodID 
        FROM dbo.Method 
        WHERE Method = @method
    ELSE 
      INSERT INTO dbo.Method(Method)
        OUTPUT INSERTED.MethodID
      VALUES (@method)
    `);
        return result.recordsets[0][0].MethodID;
    }
    catch (error) {
        throw `functionID ${error}`;
    }
};
exports.logLevels = async (db) => {
    try {
        const result = await db.request().query(`
      SELECT LevelID AS logLevelID, LogLevel AS logLevel
        FROM dbo.LogLevel;
      `);
        return result.recordsets[0];
    }
    catch (error) {
        throw error;
    }
};
exports.routeID = async (db, route, routeMethod) => {
    try {
        const result = await db
            .request()
            .input('route', mssql_1.NVarChar(250), route)
            .input('routeMethod', mssql_1.NVarChar(15), routeMethod).query(`
    IF ((SELECT COUNT(RouteID) FROM dbo.Route WHERE Route = @route AND Method ${routeMethod === undefined ? 'IS NULL' : '= @routeMethod'}) >= 1)
      SELECT RouteID 
        FROM dbo.Route 
        WHERE Route = @route AND Method ${routeMethod === undefined ? 'IS NULL' : '= @routeMethod'}
    ELSE 
      INSERT INTO dbo.Route(Route, Method)
        OUTPUT INSERTED.RouteID
      VALUES (@route, @routeMethod)
    `);
        return result.recordsets[0][0].RouteID;
    }
    catch (error) {
        throw `routeID ${error}`;
    }
};
exports.userID = async (db, user) => {
    try {
        const result = await db.request().input('user', mssql_1.NVarChar(50), user).query(`
    IF ((SELECT COUNT(UserID) FROM dbo.[User] WHERE [User] = @user) >= 1)
      SELECT UserID 
        FROM dbo.[User]
        WHERE [User] = @user
    ELSE 
      INSERT INTO dbo.[User]([User])
        OUTPUT INSERTED.UserID
      VALUES (@user)
    `);
        return result.recordsets[0][0].UserID;
    }
    catch (error) {
        throw `userID ${error}`;
    }
};
