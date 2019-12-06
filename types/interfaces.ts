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
}

export interface ConnectSQLProps {
  user: string;
  password: string;
  server: string;
  database: string;
}
