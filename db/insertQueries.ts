import sql, { ConnectionPool, NVarChar, Int } from 'mssql';
import { WriteErrorProps } from '../types/interfaces';

export const error = async (
  db: ConnectionPool,
  props: WriteErrorProps
): Promise<void> => {
  try {
    await db
      .request()
      .input('applicationID', Int, props.applicationID)
      .input('levelID', Int, props.levelID)
      .input('userID', Int, props.userID)
      .input('errorID', Int, props.errorID)
      .input('methodID', Int, props.methodID)
      .input('routeID', Int, props.routeID).query(`
    INSERT INTO dbo.Log (ApplicationID, LevelID, UserID, ErrorID, MethodID, RouteID)
    VALUES (@applicationID, @levelID, @userID, @errorID, @methodID, @routeID);`);
  } catch (error) {
    throw error;
  }
};

export const level = async (
  db: ConnectionPool,
  level: string
): Promise<number> => {
  try {
    const result = await db
      .request()
      .input('level', NVarChar(20), level)
      .output('levelID', Int).query(`
      IF ((SELECT COUNT(LevelID) FROM dbo.Level WHERE Level = @level) > 0)
          SELECT LevelID as levelID FROM dbo.Level WHERE Level = @level
      ELSE 
          INSERT INTO dbo.Level (Level) 
          OUTPUT INSERTED.levelID
          VALUES (@level)
      `);

    return result.recordsets[0][0].levelID;
  } catch (error) {
    throw error;
  }
};
