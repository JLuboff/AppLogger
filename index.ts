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
  // Used to get errorID, if error
  // exists reads ID else inserts and returns
  // the now new error id
  // ///////////////////////////////////////
  public retrieveErrorID = async (
    message: string,
    type: string | undefined
  ): Promise<number> => {
    try {
      const db = await this.connectToDatabase();
      const errorID = await read.errorID(db, message, type);

      db.close();
      return errorID;
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
      const db = await this.connectToDatabase();
      const applicationID = await read.applicationID(db, appName);

      db.close();
      return applicationID;
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Used to get routeID, if route name
  // exists reads ID else inserts and returns
  // the now new route id
  // ///////////////////////////////////////
  public retrieveRouteID = async (route: string, routeMethod: string): Promise<number> => {
    try {
      const db = await this.connectToDatabase();
      const routeID = await read.routeID(db, route, routeMethod);

      db.close();
      return routeID;
    } catch (error) {
      throw error;
    }
  };
  // ////////////////////////////////////////
  // Used to get routeID, if app name
  // exists reads ID else inserts and returns
  // the now new function id
  // ///////////////////////////////////////
  public retrieveFunctionID = async (functionName: string | Array<string>): Promise<number> => {
    try {
      const db = await this.connectToDatabase();
      const functionID = await read.functionID(db, functionName);

      db.close();
      return functionID;
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
      const db = await this.connectToDatabase();
      const userID = await read.userID(db, user);

      db.close();
      return userID;
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
      const db = await this.connectToDatabase();
      const newLogLevelID = await insert.logLevel(db, logLevel);

      db.close();
      return newLogLevelID;
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
      const db = await this.connectToDatabase();
      const logLevels = await read.logLevels(db);

      db.close();
      return logLevels;
    } catch (error) {
      throw error;
    }
  };

  public retrieveErrorLog = async (): Promise<Array<ErrorReport>> => {
    try {
      const db = await this.connectToDatabase();
      const errorLog = await read.errors(db);

      db.close();
      return errorLog;
    } catch (error) {
      throw error;
    }
  };

  public writeError = async (props: WriteErrorProps): Promise<void> => {
    try {
      const db = await this.connectToDatabase();
      await insert.error(db, {
        applicationID: props.applicationID,
        logLevelID: props.logLevelID,
        userID: props.userID,
        errorID: props.errorID,
        methodID: props.methodID,
        routeID: props.routeID
      });
      db.close();
    } catch (error) {
      throw error;
    }
  };
}
