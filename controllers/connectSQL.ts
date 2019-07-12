import { config, ConnectionPool } from 'mssql';

export const initializeDBConnection = async (
  sqlConfig: config
): Promise<ConnectionPool> => {
  try {
    const pool = new ConnectionPool(sqlConfig);
    await pool.connect();
    return pool;
  } catch (err) {
    err.function = err.function
      ? ['connectSQL.initializeDBConnection()', ...err.function]
      : ['connectSQL.initializeDBConnection()'];
    throw err;
  }
};
