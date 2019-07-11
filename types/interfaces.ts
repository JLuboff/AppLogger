export interface WriteErrorProps {
  applicationID: number;
  levelID: number;
  userID: number | undefined;
  errorID: number | undefined;
  methodID: number | undefined;
  routeID: number | undefined;
}

export interface ErrorReport {
  LogID: number;
  Application: string;
  User: string | null;
  ErrorMessage: string | null;
  ErrorType: string | null;
  Method: string | null;
  Route: string | null;
}

export interface ConnectSQLProps {
  user: string;
  password: string;
  server: string;
  database: string;
}
