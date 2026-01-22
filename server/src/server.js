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
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var dotenv_1 = require("dotenv");
var express_rate_limit_1 = require("express-rate-limit");
var http_1 = require("http");
var ws_1 = require("ws");
var path_1 = require("path");
// Import routes
var auth_1 = require("./routes/auth");
var tenants_1 = require("./routes/tenants");
var knowledge_base_1 = require("./routes/knowledge-base");
var chat_1 = require("./routes/chat");
var analytics_1 = require("./routes/analytics");
var widget_1 = require("./routes/widget");
// Import middleware
var auth_2 = require("./middleware/auth");
var errorHandler_1 = require("./middleware/errorHandler");
// Import database initialization
var database_1 = require("./db/database");
// Import WebSocket handler
var websocket_1 = require("./services/websocket");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
// Create HTTP server for WebSocket support
var server = (0, http_1.createServer)(app);
// Initialize WebSocket
var wss = new ws_1.WebSocketServer({ server: server });
(0, websocket_1.setupWebSocket)(wss);
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false
}));
// Rate limiting
var limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
// CORS configuration
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:3000',
        'https://your-frontend-domain.com' // Add your production frontend URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Static file serving for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Health check endpoint
app.get('/health', function (req, res) {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/tenants', auth_2.authenticateToken, tenants_1.default);
app.use('/api/knowledge-base', auth_2.authenticateToken, knowledge_base_1.default);
app.use('/api/chat', chat_1.default); // No auth required for public chat widget
app.use('/api/analytics', auth_2.authenticateToken, analytics_1.default);
app.use('/api/widget', widget_1.default); // No auth required for widget access
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', function (req, res) {
    res.status(404).json({ error: 'Endpoint not found' });
});
// Initialize database and start server
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, database_1.initializeDatabase)()];
                case 1:
                    _a.sent();
                    console.log('✅ Database initialized successfully');
                    server.listen(PORT, function () {
                        console.log("\uD83D\uDE80 Server running on port ".concat(PORT));
                        console.log("\uD83D\uDCF1 Health check: http://localhost:".concat(PORT, "/health"));
                        console.log("\uD83D\uDD0C WebSocket server ready");
                        console.log("\uD83C\uDF10 CORS enabled for: ".concat(process.env.FRONTEND_URL));
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('❌ Failed to start server:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
startServer();
exports.default = app;
