import { ConnectionPool, NVarChar, Int } from 'mssql';
// eslint-disable-next-line import/no-cycle
import { WriteErrorProps } from '../index';

export const newError = async (
  db: ConnectionPool,
  props: WriteErrorProps,
): Promise<void> => {
  try {
    await db
      .request()
      .input('applicationID', Int, props.applicationID)
      .input('logLevelID', Int, props.logLevelID)
      .input('userID', Int, props.userID)
      .input('errorID', Int, props.errorID)
      .input('methodID', Int, props.methodID)
      .input('routeID', Int, props.routeID)
      .query(`
    INSERT INTO dbo.Log (ApplicationID, LogLevelID, UserID, ErrorID, MethodID, RouteID)
    VALUES (@applicationID, @logLevelID, @userID, @errorID, @methodID, @routeID);`);
  } catch (error) {
    throw error;
  }
};

export const newLogLevel = async (
  db: ConnectionPool,
  logLevel: string,
): Promise<number> => {
  try {
    const result = await db
      .request()
      .input('logLevel', NVarChar(20), logLevel)
      .output('logLevelID', Int).query(`
      IF ((SELECT COUNT(LogLevelID) FROM dbo.LogLevel WHERE Level = @logLevel) > 0)
          SELECT LogLevelID as logLevelID FROM dbo.LogLevel WHERE Level = @logLevel
      ELSE 
          INSERT INTO dbo.LogLevel (LogLevel) 
          OUTPUT INSERTED.logLevelID
          VALUES (@logLevel)
      `);

    return result.recordsets[0][0].levelID;
  } catch (error) {
    throw error;
  }
};
