import { ConnectionPool, NVarChar, MAX } from 'mssql';

export const applicationID = async (
  db: ConnectionPool,
  appName: string,
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

export const errorID = async (
  db: ConnectionPool,
  message: string,
  type: string | undefined,
): Promise<number> => {
  try {
    const result = await db
      .request()
      .input('message', NVarChar(MAX), message)
      .input('type', NVarChar(MAX), type).query(`
            IF ((SELECT COUNT(ErrorID) 
              FROM dbo.Error 
              WHERE ErrorMessage = @message AND ErrorType ${
  type === undefined ? 'IS NULL' : '= @type'
}) >= 1)
                SELECT ErrorID
                FROM dbo.Error 
                WHERE ErrorMessage = @message AND ErrorType ${
  type === undefined ? 'IS NULL' : '= @type'
}
            ELSE 
              INSERT INTO dbo.Error(ErrorMessage, ErrorType)
                OUTPUT INSERTED.ErrorID
              VALUES (@message, @type)`);

    return result.recordsets[0][0].ErrorID;
  } catch (error) {
    throw new Error(`errorID ${error}`);
  }
};

export const errors = async (
  db: ConnectionPool,
): Promise<Array<ErrorReport>> => {
  try {
    const result = await db.request().query(`
            SELECT l.LogID AS logID, a.Application AS application, ll.LogLevel AS logLevel,
             e.ErrorMessage AS errorMessage, e.ErrorType AS errorType, u.[User] AS 'user', 
             m.Method AS 'function', r.Route AS route, r.Method AS routeMethod, 
             l.TimeOccured As logTime
            FROM dbo.Log l 
              INNER JOIN dbo.Application AS a 
                ON l.ApplicationID = a.ApplicationID
              INNER JOIN dbo.LogLevel AS ll 
                ON l.LogLevelID = ll.LogLevelID
              LEFT JOIN dbo.Error AS e 
                ON l.ErrorID = e.ErrorID
              LEFT JOIN dbo.[User] AS u
                ON l.UserID = u.UserID
              LEFT JOIN dbo.Method AS m
                ON l.MethodID = m.MethodID
              LEFT JOIN dbo.Route AS r 
                ON l.RouteID = r.RouteID`);

    return result.recordsets[0];
  } catch (error) {
    throw error;
  }
};

export const functionID = async (
  db: ConnectionPool,
  method: string | Array<string>,
): Promise<number> => {
  try {
    const result = await db.request().input('method', NVarChar(MAX), method)
      .query(`
    IF ((SELECT COUNT(MethodID) FROM dbo.Method WHERE Method = @method) >= 1)
      SELECT MethodID 
        FROM dbo.Method 
        WHERE Method = @method
    ELSE 
      INSERT INTO dbo.Method(Method)
        OUTPUT INSERTED.MethodID
      VALUES (@method)
    `);

    return result.recordsets[0][0].MethodID;
  } catch (error) {
    throw new Error(`functionID ${error}`);
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
export const routeID = async (
  db: ConnectionPool,
  route: string,
  routeMethod: string,
): Promise<number> => {
  try {
    const result = await db
      .request()
      .input('route', NVarChar(250), route)
      .input('routeMethod', NVarChar(15), routeMethod).query(`
    IF ((SELECT COUNT(RouteID) FROM dbo.Route WHERE Route = @route AND Method ${
  routeMethod === undefined ? 'IS NULL' : '= @routeMethod'
}) >= 1)
      SELECT RouteID 
        FROM dbo.Route 
        WHERE Route = @route AND Method ${
  routeMethod === undefined ? 'IS NULL' : '= @routeMethod'
}
    ELSE 
      INSERT INTO dbo.Route(Route, Method)
        OUTPUT INSERTED.RouteID
      VALUES (@route, @routeMethod)
    `);

    return result.recordsets[0][0].RouteID;
  } catch (error) {
    throw new Error(`routeID ${error}`);
  }
};
export const userID = async (
  db: ConnectionPool,
  user: string,
): Promise<number> => {
  try {
    const result = await db.request().input('user', NVarChar(50), user).query(`
    IF ((SELECT COUNT(UserID) FROM dbo.[User] WHERE [User] = @user) >= 1)
      SELECT UserID 
        FROM dbo.[User]
        WHERE [User] = @user
    ELSE 
      INSERT INTO dbo.[User]([User])
        OUTPUT INSERTED.UserID
      VALUES (@user)
    `);

    return result.recordsets[0][0].UserID;
  } catch (error) {
    throw new Error(`userID ${error}`);
  }
};
