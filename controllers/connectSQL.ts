import sql from 'mssql';
import { ConnectSQLProps } from '../types/interfaces';

export const initializeDBConnection = async (
  sqlConfig: ConnectSQLProps
): Promise<sql.ConnectionPool> => {
  try {
    const pool = new sql.ConnectionPool(sqlConfig);
    const poolConnected = pool.connect();
    await poolConnected;
    return pool;
  } catch (err) {
    err.function = err.function
      ? ['connectSQL.initializeDBConnection()', ...err.function]
      : ['connectSQL.initializeDBConnection()'];
    throw err;
  }
};
