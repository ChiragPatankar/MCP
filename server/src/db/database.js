"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
exports.initializeDatabase = initializeDatabase;
var sqlite3_1 = require("sqlite3");
var util_1 = require("util");
var path_1 = require("path");
var fs_1 = require("fs");
// Enable verbose mode for debugging
var Database = sqlite3_1.default.verbose().Database;
var DatabaseConnection = /** @class */ (function () {
    function DatabaseConnection() {
        this.db = null;
    }
    DatabaseConnection.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbPath, dbDir;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.db) {
                    return [2 /*return*/, this.db];
                }
                dbPath = process.env.DATABASE_URL || path_1.default.join(__dirname, '../../database.sqlite');
                dbDir = path_1.default.dirname(dbPath);
                if (!fs_1.default.existsSync(dbDir)) {
                    fs_1.default.mkdirSync(dbDir, { recursive: true });
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db = new Database(dbPath, function (err) {
                            if (err) {
                                console.error('Error opening database:', err.message);
                                reject(err);
                            }
                            else {
                                console.log('Connected to SQLite database');
                                resolve(_this.db);
                            }
                        });
                    })];
            });
        });
    };
    DatabaseConnection.prototype.query = function (sql_1) {
        return __awaiter(this, arguments, void 0, function (sql, params) {
            var db, all;
            if (params === void 0) { params = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        db = _a.sent();
                        all = (0, util_1.promisify)(db.all.bind(db));
                        return [2 /*return*/, all(sql, params)];
                }
            });
        });
    };
    DatabaseConnection.prototype.run = function (sql_1) {
        return __awaiter(this, arguments, void 0, function (sql, params) {
            var db, run;
            if (params === void 0) { params = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        db = _a.sent();
                        run = (0, util_1.promisify)(db.run.bind(db));
                        return [2 /*return*/, run(sql, params)];
                }
            });
        });
    };
    DatabaseConnection.prototype.get = function (sql_1) {
        return __awaiter(this, arguments, void 0, function (sql, params) {
            var db, get;
            if (params === void 0) { params = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        db = _a.sent();
                        get = (0, util_1.promisify)(db.get.bind(db));
                        return [2 /*return*/, get(sql, params)];
                }
            });
        });
    };
    DatabaseConnection.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.db) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.db.close(function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    _this.db = null;
                                    resolve();
                                }
                            });
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    return DatabaseConnection;
}());
// Singleton instance
exports.database = new DatabaseConnection();
// Database initialization function
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var createTables, createIndexes, _i, createTables_1, sql, _a, createIndexes_1, sql, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    createTables = [
                        // Users table
                        "CREATE TABLE IF NOT EXISTS users (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      email TEXT UNIQUE NOT NULL,\n      name TEXT NOT NULL,\n      password_hash TEXT,\n      avatar TEXT,\n      google_id TEXT UNIQUE,\n      email_verified BOOLEAN DEFAULT FALSE,\n      verification_token TEXT,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n    )",
                        // Tenants table
                        "CREATE TABLE IF NOT EXISTS tenants (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      name TEXT NOT NULL,\n      subdomain TEXT UNIQUE,\n      plan TEXT DEFAULT 'starter',\n      settings TEXT DEFAULT '{}',\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n    )",
                        // User-Tenant relationships
                        "CREATE TABLE IF NOT EXISTS user_tenants (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      user_id INTEGER NOT NULL,\n      tenant_id INTEGER NOT NULL,\n      role TEXT DEFAULT 'owner',\n      permissions TEXT DEFAULT '{}',\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,\n      FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,\n      UNIQUE(user_id, tenant_id)\n    )",
                        // Domains table
                        "CREATE TABLE IF NOT EXISTS domains (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      tenant_id INTEGER NOT NULL,\n      domain TEXT NOT NULL,\n      verified BOOLEAN DEFAULT FALSE,\n      verification_token TEXT,\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE\n    )",
                        // Knowledge base table
                        "CREATE TABLE IF NOT EXISTS knowledge_base (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      tenant_id INTEGER NOT NULL,\n      name TEXT NOT NULL,\n      type TEXT NOT NULL,\n      source TEXT NOT NULL,\n      status TEXT DEFAULT 'processing',\n      size INTEGER,\n      metadata TEXT DEFAULT '{}',\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE\n    )",
                        // Chat sessions table
                        "CREATE TABLE IF NOT EXISTS chat_sessions (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      tenant_id INTEGER NOT NULL,\n      domain TEXT,\n      user_ip TEXT,\n      user_agent TEXT,\n      session_token TEXT UNIQUE NOT NULL,\n      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      ended_at DATETIME,\n      resolved BOOLEAN DEFAULT FALSE,\n      rating INTEGER,\n      feedback TEXT,\n      FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE\n    )",
                        // Chat messages table
                        "CREATE TABLE IF NOT EXISTS chat_messages (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      session_id INTEGER NOT NULL,\n      sender TEXT NOT NULL, -- 'user' or 'ai'\n      message TEXT NOT NULL,\n      metadata TEXT DEFAULT '{}',\n      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE CASCADE\n    )",
                        // Analytics events table
                        "CREATE TABLE IF NOT EXISTS analytics_events (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      tenant_id INTEGER NOT NULL,\n      event_type TEXT NOT NULL,\n      event_data TEXT DEFAULT '{}',\n      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE\n    )",
                        // Widget configurations table
                        "CREATE TABLE IF NOT EXISTS widget_configs (\n      id INTEGER PRIMARY KEY AUTOINCREMENT,\n      tenant_id INTEGER NOT NULL,\n      config TEXT NOT NULL DEFAULT '{}',\n      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE\n    )"
                    ];
                    createIndexes = [
                        "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
                        "CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)",
                        "CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain)",
                        "CREATE INDEX IF NOT EXISTS idx_user_tenants_user_id ON user_tenants(user_id)",
                        "CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant_id ON user_tenants(tenant_id)",
                        "CREATE INDEX IF NOT EXISTS idx_domains_tenant_id ON domains(tenant_id)",
                        "CREATE INDEX IF NOT EXISTS idx_knowledge_base_tenant_id ON knowledge_base(tenant_id)",
                        "CREATE INDEX IF NOT EXISTS idx_chat_sessions_tenant_id ON chat_sessions(tenant_id)",
                        "CREATE INDEX IF NOT EXISTS idx_chat_sessions_token ON chat_sessions(session_token)",
                        "CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id)",
                        "CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_id ON analytics_events(tenant_id)",
                        "CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp)"
                    ];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    _i = 0, createTables_1 = createTables;
                    _b.label = 2;
                case 2:
                    if (!(_i < createTables_1.length)) return [3 /*break*/, 5];
                    sql = createTables_1[_i];
                    return [4 /*yield*/, exports.database.run(sql)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _a = 0, createIndexes_1 = createIndexes;
                    _b.label = 6;
                case 6:
                    if (!(_a < createIndexes_1.length)) return [3 /*break*/, 9];
                    sql = createIndexes_1[_a];
                    return [4 /*yield*/, exports.database.run(sql)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    _a++;
                    return [3 /*break*/, 6];
                case 9:
                    console.log('Database tables and indexes created successfully');
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _b.sent();
                    console.error('Error initializing database:', error_1);
                    throw error_1;
                case 11: return [2 /*return*/];
            }
        });
    });
}
