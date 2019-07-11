import sql, { ConnectionPool } from 'mssql';
import { WriteErrorProps } from '../types/interfaces';

export const error = async (
  db: ConnectionPool,
  props: WriteErrorProps
): Promise<void> => {
  try {
    await db
      .request()
      .input('applicationID', sql.Int, props.applicationID)
      .input('levelID', sql.Int, props.levelID)
      .input('userID', sql.Int, props.userID)
      .input('errorID', sql.Int, props.errorID)
      .input('methodID', sql.Int, props.methodID)
      .input('routeID', sql.Int, props.routeID).query(`
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
      .input('level', sql.NVarChar(20), level)
      .output('levelID', sql.Int).query(`
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
