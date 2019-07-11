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
        this.addApplication = () => { };
        this.retrieveApplicationID = () => { };
        this.addLevel = () => { };
        this.retrieveLevel = () => { };
        this.getErrorLog = async () => {
            const db = await this.connectToDatabase();
            const errorLog = await read.errors(db);
            db.close();
            return errorLog;
        };
        this.writeError = async (props) => {
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
            }
            catch (error) {
                throw error;
            }
        };
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
        this.user = props.user;
        this.password = props.password;
        this.server = props.server;
        this.database = props.database || 'AppLogger';
    }
}
exports.default = AppLogger;
