import { config, ConnectionPool } from 'mssql';

const initializeDBConnection = async (
  sqlConfig: config,
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

export default initializeDBConnection;
