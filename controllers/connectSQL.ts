import { config, ConnectionPool } from 'mssql';
/**
 * Establishes database connection.
 * @param sqlConfig
 * config | string
 * @returns
 * ConnectionPool
 */
const initializeDBConnection = async (
  sqlConfig: config | string,
): Promise<ConnectionPool> => {
  try {
    const pool = new ConnectionPool(sqlConfig as any);
    await pool.connect();
    return pool;
  } catch (err) {
    err.function = err.function
      ? ['connectSQL.initializeDBConnection()', ...err.function]
      : ['connectSQL.initializeDBConnection()'];
    throw err;
  }
};

export default initializeDBConnection;
