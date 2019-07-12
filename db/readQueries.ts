import { ConnectionPool, NVarChar } from 'mssql';
import { ErrorReport } from '../types/interfaces';

export const applicationID = async (
  db: ConnectionPool,
  appName: string
): Promise<number> => {
  try {
    const result = await db.request().input('appName', NVarChar(50), appName)
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
  } catch (error) {
    throw error;
  }
};
export const errors = async (
  db: ConnectionPool
): Promise<Array<ErrorReport>> => {
  try {
    const result = await db.request().query(`
            SELECT LogID AS logID, a.Application AS application, l.LogLevel AS logLevel,
             u.[User] AS 'user', e.ErrorMessage AS errorMessage, e.ErrorType AS errorType, 
             m.Method AS method, r.Route AS route, r.Method AS routeMethod
            FROM dbo.Log
                INNER JOIN dbo.Application AS a
                ON Log.ApplicationID = a.ApplicationID
                INNER JOIN dbo.LogLevel AS l
                ON Log.LogLevelID = l.LogLevelID
                LEFT JOIN dbo.[User] AS u
                ON Log.UserID = u.UserID
                LEFT JOIN dbo.Error AS e
                ON Log.ErrorID = e.ErrorID
                LEFT JOIN dbo.Method AS m
                ON Log.MethodID = m.MethodID
                LEFT JOIN dbo.Route AS r
                ON Log.RouteID = r.RouteID`);

    return result.recordsets[0];
  } catch (error) {
    throw error;
  }
};

export const logLevels = async (db: ConnectionPool): Promise<Array<any>> => {
  try {
    const result = await db.request().query(`
      SELECT LevelID AS logLevelID, LogLevel AS logLevel
        FROM dbo.LogLevel;
      `);

    return result.recordsets[0];
  } catch (error) {
    throw error;
  }
};
