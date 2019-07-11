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
