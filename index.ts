/* eslint-disable import/no-cycle */
import { ConnectionPool, config } from 'mssql';
import nodeMailer, { SendMailOptions } from 'nodemailer';
import initializeDBConnection from './controllers/connectSQL';
import * as insert from './db/insertQueries';
import * as read from './db/readQueries';

export interface WriteErrorProps {
  applicationID: number;
  logLevelID: number;
  userID: number | undefined;
  errorID: number | undefined;
  methodID: number | undefined;
  routeID: number | undefined;
}

export interface ErrorReport {
  logID: number;
  application: string;
  logLevel: string;
  user: string | null;
  errorMessage: string | null;
  errorType: string | null;
  method: string | null;
  route: string | null;
  routeMethod: string | null;
  function: string | null;
}

type SMTPHostSettings =
  | {
    host: string;
    port: 25 | number;
    secure: boolean;
    auth?: { user: string; pass: string };
  }
  | { service: string; auth: { user: string; pass: string } };

type EmailSettings = {
  logLevelID: number;
  subject?: string;
  sendTo: string[];
  from: string;
};

export interface ConnectSQLProps {
  user: string;
  password: string;
  server: string;
  database: string;
  connectionString: string | undefined;
  enableEmailing: boolean;
  smtpHostSettings?: SMTPHostSettings;
  emailSettings?: EmailSettings[];
  port?: number;
}

export default class AppLogger {
  private user: string;

  private password: string;

  private server: string;

  private database: string;

  private connectionString: string | undefined;

  private enableEmailing: boolean;

  private smtpHostSettings?: SMTPHostSettings;

  private emailSettings?: EmailSettings[];

  private port: number;

  constructor(props: ConnectSQLProps) {
    this.user = props.user;
    this.password = props.password;
    this.server = props.server;
    this.database = props.database || 'AppLogger';
    this.connectionString = props.connectionString;
    this.enableEmailing = props.enableEmailing || false;
    this.smtpHostSettings = props.smtpHostSettings;
    this.emailSettings = props.emailSettings;
    this.port = props?.port ?? 1433;
  }

  // ////////////////////////////////////////
  /**
   * Initializes database connection
   * @async
   * @returns
   * ConnectionPool
   */
  // ///////////////////////////////////////
  private connectToDatabase = async (): Promise<ConnectionPool> => {
    try {
      /**
       * If connectionString is not undefined or an empty string, use it.
       * Else,use config object
       */
      const sqlConfig = this.connectionString?.trim() !== ''
        ? (this.connectionString as string)
        : ({
          user: this.user,
          password: this.password,
          server: this.server,
          database: this.database,
          port: this.port,
          options: {
            port: this.port,
            enableArithAbort: true,
          },
        } as config);
      const connect = await initializeDBConnection(sqlConfig);

      return connect;
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Initializes connection to SMTP Server and sends email
   * @async
   * @param message SendMailOptions
   */
  // ///////////////////////////////////////
  private sendMail = async (message: SendMailOptions): Promise<void> => {
    try {
      /**
       * Establishes mail transporter
       */
      const transporter = nodeMailer.createTransport(this.smtpHostSettings);
      /**
       * Verify SMTP service is available, throw error otherwise
       */
      const smtpServiceIsVerified = await transporter.verify();
      if (!smtpServiceIsVerified) {
        throw new Error('The SMTP service is currently not available');
      }

      await transporter.sendMail(message);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Creates the main email message for sending error information
   * @async
   * @param errorID number
   * @param emailParameters EmailSettings
   */
  private createMailMessage = async (
    errorID: number,
    emailParameters: EmailSettings,
  ): Promise<void> => {
    try {
      const getErrorResult: ErrorReport[] = await this.runQuery(read.errors, [
        errorID,
      ]);
      const {
        application,
        logLevel,
        errorMessage,
        errorType,
        user,
        function: method,
        route,
        routeMethod,
      } = getErrorResult[0];
      const { from, subject, sendTo } = emailParameters;
      const message: SendMailOptions = {
        from,
        subject:
          subject ?? `${application} has thrown a ${logLevel} level error`,
        to: sendTo,
        html: `<p>The following error has occured for ${application}</p>
                  <table style="border-color: #666" cellpadding="7">
                    <thead>
                      <tr>
                        <th colspan="2" style="background: #eee">
                          <strong>${logLevel} level error</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Application</strong>
                        </td>
                        <td>
                          ${application}
                        </td>
                      </tr>
                      ${
  errorType
                        && `<tr>
                        <td>
                          <strong>Error Type</strong>
                        </td>
                        <td>
                          ${errorType}
                        </td>
                      </tr>`
}
                      <tr>
                        <td>
                          <strong>Error Message</strong>
                        </td>
                        <td>
                          ${errorMessage}
                        </td>
                      </tr>
                      ${
  user
                        && `<tr>
                        <td>
                          <strong>User</strong>
                        </td>
                        <td>
                          ${user}
                        </td>
                      </tr>`
}
                      ${
  method
                        && `<tr>
                        <td>
                          <strong>Function</strong>
                        </td>
                        <td>
                          ${method}
                        </td>
                      </tr>`
}
                      ${
  route
                        && `<tr>
                        <td>
                          <strong>Route</strong>
                        </td>
                        <td>
                          ${routeMethod}: ${route}
                        </td>
                      </tr>`
}
                    </tbody>
                  </table>
                  `,
      };
      this.sendMail(message);
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Opens connection to database, runs query,
   * closes database connection and sends results.
   * @async
   * @param cb any
   * @param args any[] | null
   */
  // ///////////////////////////////////////
  private runQuery = async (cb: any, args: any[] | null): Promise<any> => {
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
  /**
   *  Used to get errorID, if error exists reads ID
   * else inserts and returns the now new error id.
   * @async
   * @param message string
   * @param type string | undefined
   * @returns number
   */
  // ///////////////////////////////////////
  public retrieveErrorID = async (
    message: string,
    type: string | undefined,
  ): Promise<number> => {
    try {
      return await this.runQuery(read.errorID, [message, type]);
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Used to get applicationID, if app name exists reads ID
   * else inserts and returns the now new app id.
   * @async
   * @param appName string
   * @returns number
   */
  // ///////////////////////////////////////
  public retrieveApplicationID = async (appName: string): Promise<number> => {
    try {
      return await this.runQuery(read.applicationID, [appName]);
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Used to get routeID, if route name exists reads ID
   * else inserts and returns the now new route id.
   * @async
   * @param route string
   * @param routeMethod string
   * @returns number
   */
  // ///////////////////////////////////////
  public retrieveRouteID = async (
    route: string,
    routeMethod: string,
  ): Promise<number> => {
    try {
      return await this.runQuery(read.routeID, [route, routeMethod]);
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Used to get routeID, if app name exists reads ID
   * else inserts and returns the now new function id.
   * @async
   * @param functionName string | string[]
   * @returns number
   */
  // ///////////////////////////////////////
  public retrieveFunctionID = async (
    functionName: string | string[],
  ): Promise<number> => {
    try {
      return await this.runQuery(read.functionID, [functionName]);
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Used to get userID, if user exists reads ID
   * else inserts and returns the now new user id.
   * @async
   * @param user string
   * @returns number
   */
  // ///////////////////////////////////////
  public retrieveUserID = async (user: string): Promise<number> => {
    try {
      return await this.runQuery(read.userID, [user]);
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Creates a new log level if it doesn't already exist.
   * @async
   * @param logLevel string
   * @returns number
   */
  // ///////////////////////////////////////
  public addLogLevel = async (logLevel: string): Promise<number> => {
    try {
      return await this.runQuery(insert.newLogLevel, [logLevel]);
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Retrieves list of Log levels and their ID's.
   * @async
   * @returns any
   */
  // ///////////////////////////////////////
  public retrieveLogLevel = async () => {
    try {
      return await this.runQuery(read.logLevels, null);
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Retrieves list of all logs.
   * @async
   * @returns ErrorReport[]
   */
  // ///////////////////////////////////////
  public retrieveErrorLog = async (): Promise<ErrorReport[]> => {
    try {
      return await this.runQuery(read.errors, null);
    } catch (error) {
      throw error;
    }
  };

  // ////////////////////////////////////////
  /**
   * Writes a log entry to the database.
   * @async
   * @param props WriteErrorProps
   */
  // ///////////////////////////////////////
  public writeError = async (props: WriteErrorProps): Promise<void> => {
    try {
      await this.runQuery(insert.newError, [
        {
          applicationID: props.applicationID,
          logLevelID: props.logLevelID,
          userID: props.userID,
          errorID: props.errorID,
          methodID: props.methodID,
          routeID: props.routeID,
        },
      ]);

      const logLevelForEmail = this.emailSettings?.filter(
        ({ logLevelID }) => logLevelID === props.logLevelID,
      );
      if (this.enableEmailing && logLevelForEmail && logLevelForEmail.length) {
        this.createMailMessage(props.errorID as number, logLevelForEmail[0]);
      }
    } catch (error) {
      throw error;
    }
  };
}
