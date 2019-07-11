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

  public addApplication = () => {};
  public retrieveApplicationID = () => {};

  public addLevel = async (level: string): Promise<number> => {
    try {
      const db = await this.connectToDatabase();
      const newLevelID = await insert.level(db, level);

      db.close();
      return newLevelID;
    } catch (error) {
      throw error;
    }
  };

  public retrieveLevel = async () => {
    try {
      const db = await this.connectToDatabase();
      const levels = await read.levels(db);

      db.close();
      return levels;
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
        levelID: props.levelID,
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
