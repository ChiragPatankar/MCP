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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var database_1 = require("../db/database");
var router = express_1.default.Router();
// Get dashboard metrics
router.get('/metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, totalConversations, thisMonthConversations, avgRating, resolutionRate, knowledgeBaseCount, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                tenantId = req.user.tenantId;
                return [4 /*yield*/, database_1.database.get('SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ?', [tenantId])];
            case 1:
                totalConversations = _a.sent();
                return [4 /*yield*/, database_1.database.get("SELECT COUNT(*) as count FROM chat_sessions \n       WHERE tenant_id = ? AND created_at >= date('now', 'start of month')", [tenantId])];
            case 2:
                thisMonthConversations = _a.sent();
                return [4 /*yield*/, database_1.database.get('SELECT AVG(rating) as avg FROM chat_sessions WHERE tenant_id = ? AND rating IS NOT NULL', [tenantId])];
            case 3:
                avgRating = _a.sent();
                return [4 /*yield*/, database_1.database.get("SELECT \n         COUNT(CASE WHEN resolved = 1 THEN 1 END) * 100.0 / COUNT(*) as rate\n       FROM chat_sessions WHERE tenant_id = ?", [tenantId])];
            case 4:
                resolutionRate = _a.sent();
                return [4 /*yield*/, database_1.database.get('SELECT COUNT(*) as count FROM knowledge_base WHERE tenant_id = ? AND status = "active"', [tenantId])];
            case 5:
                knowledgeBaseCount = _a.sent();
                res.json({
                    totalConversations: totalConversations.count || 0,
                    thisMonthConversations: thisMonthConversations.count || 0,
                    averageRating: parseFloat((avgRating.avg || 0).toFixed(1)),
                    resolutionRate: parseFloat((resolutionRate.rate || 0).toFixed(1)),
                    knowledgeBaseDocuments: knowledgeBaseCount.count || 0
                });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error('Get metrics error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Get conversation trends
router.get('/conversations', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, _a, period, dateRange, conversations, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                tenantId = req.user.tenantId;
                _a = req.query.period, period = _a === void 0 ? '7d' : _a;
                dateRange = '';
                switch (period) {
                    case '1d':
                        dateRange = "date('now', '-1 day')";
                        break;
                    case '7d':
                        dateRange = "date('now', '-7 days')";
                        break;
                    case '30d':
                        dateRange = "date('now', '-30 days')";
                        break;
                    default:
                        dateRange = "date('now', '-7 days')";
                }
                return [4 /*yield*/, database_1.database.query("SELECT \n         date(started_at) as date,\n         COUNT(*) as count,\n         AVG(CASE WHEN rating IS NOT NULL THEN rating END) as avg_rating,\n         COUNT(CASE WHEN resolved = 1 THEN 1 END) * 100.0 / COUNT(*) as resolution_rate\n       FROM chat_sessions \n       WHERE tenant_id = ? AND started_at >= ".concat(dateRange, "\n       GROUP BY date(started_at)\n       ORDER BY date"), [tenantId])];
            case 1:
                conversations = _b.sent();
                res.json({ conversations: conversations });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Get conversations error:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get chat history with filters
router.get('/chat-history', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, _a, _b, limit, _c, offset, status_1, sentiment, whereClause, params, conversations, error_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                tenantId = req.user.tenantId;
                _a = req.query, _b = _a.limit, limit = _b === void 0 ? 50 : _b, _c = _a.offset, offset = _c === void 0 ? 0 : _c, status_1 = _a.status, sentiment = _a.sentiment;
                whereClause = 'WHERE cs.tenant_id = ?';
                params = [tenantId];
                if (status_1 === 'resolved') {
                    whereClause += ' AND cs.resolved = 1';
                }
                else if (status_1 === 'unresolved') {
                    whereClause += ' AND cs.resolved = 0';
                }
                return [4 /*yield*/, database_1.database.query("SELECT \n         cs.id, cs.session_token, cs.started_at, cs.ended_at, cs.resolved, cs.rating, cs.feedback,\n         (SELECT message FROM chat_messages WHERE session_id = cs.id AND sender = 'user' ORDER BY timestamp LIMIT 1) as first_message,\n         (SELECT COUNT(*) FROM chat_messages WHERE session_id = cs.id) as message_count\n       FROM chat_sessions cs\n       ".concat(whereClause, "\n       ORDER BY cs.started_at DESC\n       LIMIT ? OFFSET ?"), __spreadArray(__spreadArray([], params, true), [limit, offset], false))];
            case 1:
                conversations = _d.sent();
                res.json({ conversations: conversations });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _d.sent();
                console.error('Get chat history error:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get top questions/issues
router.get('/top-questions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, topQuestions, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tenantId = req.user.tenantId;
                return [4 /*yield*/, database_1.database.query("SELECT \n         cm.message,\n         COUNT(*) as frequency\n       FROM chat_messages cm\n       JOIN chat_sessions cs ON cm.session_id = cs.id\n       WHERE cs.tenant_id = ? AND cm.sender = 'user'\n       GROUP BY cm.message\n       HAVING frequency > 1\n       ORDER BY frequency DESC\n       LIMIT 10", [tenantId])];
            case 1:
                topQuestions = _a.sent();
                res.json({ topQuestions: topQuestions });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Get top questions error:', error_4);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get sentiment analysis
router.get('/sentiment', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, totalSessions, resolvedSessions, highRatingSessions, total, positive, negative, neutral, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                tenantId = req.user.tenantId;
                return [4 /*yield*/, database_1.database.get('SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ?', [tenantId])];
            case 1:
                totalSessions = _a.sent();
                return [4 /*yield*/, database_1.database.get('SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ? AND resolved = 1', [tenantId])];
            case 2:
                resolvedSessions = _a.sent();
                return [4 /*yield*/, database_1.database.get('SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ? AND rating >= 4', [tenantId])];
            case 3:
                highRatingSessions = _a.sent();
                total = totalSessions.count || 1;
                positive = (resolvedSessions.count || 0) * 0.7 + (highRatingSessions.count || 0) * 0.3;
                negative = total * 0.1;
                neutral = total - positive - negative;
                res.json({
                    sentiment: {
                        positive: Math.round((positive / total) * 100),
                        neutral: Math.round((neutral / total) * 100),
                        negative: Math.round((negative / total) * 100)
                    }
                });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error('Get sentiment error:', error_5);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
