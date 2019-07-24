"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectSQL_1 = require("./controllers/connectSQL");
const insert = __importStar(require("./db/insertQueries"));
const read = __importStar(require("./db/readQueries"));
class AppLogger {
    constructor(props) {
        // ////////////////////////////////////////
        // Initializes database connection
        // ///////////////////////////////////////
        this.connectToDatabase = async () => {
            try {
                const sqlConfig = {
                    user: this.user,
                    password: this.password,
                    server: this.server,
                    database: this.database
                };
                const connect = await connectSQL_1.initializeDBConnection(sqlConfig);
                return connect;
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Opens connection to database, runs query,
        // closes database connection and sends results
        // ///////////////////////////////////////
        this.runQuery = async (cb, args) => {
            try {
                const db = await this.connectToDatabase();
                const result = args === null ? await cb(db) : await cb(db, ...args);
                db.close();
                return result;
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Used to get errorID, if error
        // exists reads ID else inserts and returns
        // the now new error id
        // ///////////////////////////////////////
        this.retrieveErrorID = async (message, type) => {
            try {
                return await this.runQuery(read.errorID, [message, type]);
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Used to get applicationID, if app name
        // exists reads ID else inserts and returns
        // the now new app id
        // ///////////////////////////////////////
        this.retrieveApplicationID = async (appName) => {
            try {
                return await this.runQuery(read.applicationID, [appName]);
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Used to get routeID, if route name
        // exists reads ID else inserts and returns
        // the now new route id
        // ///////////////////////////////////////
        this.retrieveRouteID = async (route, routeMethod) => {
            try {
                return await this.runQuery(read.routeID, [route, routeMethod]);
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Used to get routeID, if app name
        // exists reads ID else inserts and returns
        // the now new function id
        // ///////////////////////////////////////
        this.retrieveFunctionID = async (functionName) => {
            try {
                return await this.runQuery(read.functionID, [functionName]);
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Used to get userID, if user
        // exists reads ID else inserts and returns
        // the now new user id
        // ///////////////////////////////////////
        this.retrieveUserID = async (user) => {
            try {
                return await this.runQuery(read.userID, [user]);
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Creates a new log level if it doesn't
        // already exist
        // ///////////////////////////////////////
        this.addLogLevel = async (logLevel) => {
            try {
                return await this.runQuery(insert.logLevel, [logLevel]);
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Retrieves list of Log levels and their
        // ID's
        // ///////////////////////////////////////
        this.retrieveLogLevel = async () => {
            try {
                return await this.runQuery(read.logLevels, null);
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Retrieves list of all logs
        // ///////////////////////////////////////
        this.retrieveErrorLog = async () => {
            try {
                return await this.runQuery(read.errors, null);
            }
            catch (error) {
                throw error;
            }
        };
        // ////////////////////////////////////////
        // Writes a log entry to the database
        // ///////////////////////////////////////
        this.writeError = async (props) => {
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
            }
            catch (error) {
                throw error;
            }
        };
        this.user = props.user;
        this.password = props.password;
        this.server = props.server;
        this.database = props.database || 'AppLogger';
    }
}
exports.default = AppLogger;
