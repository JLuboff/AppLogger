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
  } catch (error) {
    error.function = [
      'connectSQL.initializeDBConnection()',
      ...(error?.function ?? []),
    ];
    throw error;
  }
};

export default initializeDBConnection;
