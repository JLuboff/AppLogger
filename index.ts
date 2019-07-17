import { ConnectionPool } from 'mssql';
import { initializeDBConnection } from './controllers/connectSQL';
import {
  WriteErrorProps,
  ConnectSQLProps,
  ErrorReport
} from './types/interfaces';
import * as insert from './db/insertQueries';
import * as read from './db/readQueries';

export default class AppLogger {
  private user: string;
  private password: string;
  private server: string;
  private database: string;

  constructor(props: ConnectSQLProps) {
    this.user = props.user;
    this.password = props.password;
    this.server = props.server;
    this.database = props.database || 'AppLogger';
  }
  // ////////////////////////////////////////
  // Initializes database connection
  // ///////////////////////////////////////
  private connectToDatabase = async (): Promise<ConnectionPool> => {
    try {
      const sqlConfig = {
        user: this.user,
        password: this.password,
        server: this.server,
        database: this.database
      };
      const connect = await initializeDBConnection(sqlConfig);

      return connect;
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Opens connection to database, runs query,
  // closes database connection and sends results
  // ///////////////////////////////////////
  private runQuery = async (cb: any, args: Array<any> | null): Promise<any> => {
    try {
      const db = await this.connectToDatabase();
      const result = args === null ? await cb(db) : await cb(db, ...args);
      db.close();
      return result;
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Used to get errorID, if error
  // exists reads ID else inserts and returns
  // the now new error id
  // ///////////////////////////////////////
  public retrieveErrorID = async (
    message: string,
    type: string | undefined
  ): Promise<number> => {
    try {
      return await this.runQuery(read.errorID, [message, type]);
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Used to get applicationID, if app name
  // exists reads ID else inserts and returns
  // the now new app id
  // ///////////////////////////////////////
  public retrieveApplicationID = async (appName: string): Promise<number> => {
    try {
      return await this.runQuery(read.applicationID, [appName]);
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Used to get routeID, if route name
  // exists reads ID else inserts and returns
  // the now new route id
  // ///////////////////////////////////////
  public retrieveRouteID = async (
    route: string,
    routeMethod: string
  ): Promise<number> => {
    try {
      return await this.runQuery(read.routeID, [route, routeMethod]);
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Used to get routeID, if app name
  // exists reads ID else inserts and returns
  // the now new function id
  // ///////////////////////////////////////
  public retrieveFunctionID = async (
    functionName: string | Array<string>
  ): Promise<number> => {
    try {
      return await this.runQuery(read.functionID, [functionName]);
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Used to get userID, if user
  // exists reads ID else inserts and returns
  // the now new user id
  // ///////////////////////////////////////
  public retrieveUserID = async (user: string): Promise<number> => {
    try {
      return await this.runQuery(read.userID, [user]);
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Creates a new log level if it doesn't
  // already exist
  // ///////////////////////////////////////
  public addLogLevel = async (logLevel: string): Promise<number> => {
    try {
      return await this.runQuery(insert.logLevel, [logLevel]);
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Retrieves list of Log levels and their
  // ID's
  // ///////////////////////////////////////
  public retrieveLogLevel = async () => {
    try {
      return await this.runQuery(read.logLevels, null);
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Retrieves list of all logs
  // ///////////////////////////////////////
  public retrieveErrorLog = async (): Promise<Array<ErrorReport>> => {
    try {
      return await this.runQuery(read.errors, null);
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Writes a log entry to the database
  // ///////////////////////////////////////
  public writeError = async (props: WriteErrorProps): Promise<void> => {
    try {
      await this.runQuery(insert.error, [
        {
          applicationID: props.applicationID,
          logLevelID: props.logLevelID,
          userID: props.userID,
          errorID: props.errorID,
          methodID: props.methodID,
          routeID: props.routeID
        }
      ]);
    } catch (error) {
      throw error;
    }
  };
}
