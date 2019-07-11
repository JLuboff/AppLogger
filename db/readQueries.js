"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = async (db) => {
    try {
        const result = await db.request().query(`
            SELECT LogID, a.Application, l.Level, u.[User], e.ErrorMessage, 
            e.ErrorType, m.Method, r.Route, r.Method
            FROM dbo.Log
                INNER JOIN dbo.Application AS a
                ON Log.ApplicationID = a.ApplicationID
                INNER JOIN dbo.Level AS l
                ON Log.LevelID = l.LevelID
                LEFT JOIN dbo.[User] AS u
                ON Log.UserID = u.UserID
                LEFT JOIN dbo.Error AS e
                ON Log.ErrorID = e.ErrorID
                LEFT JOIN dbo.Method AS m
                ON Log.MethodID = m.MethodID
                LEFT JOIN dbo.Route AS r
                ON Log.RouteID = r.RouteID`);
        return result.recordsets[0];
    }
    catch (error) {
        throw error;
    }
};
