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
var uuid_1 = require("uuid");
var axios_1 = require("axios");
var database_1 = require("../db/database");
var router = express_1.default.Router();
// Create a new chat session
router.post('/sessions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tenantId, domain, userAgent, userIp, tenant, sessionToken, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, tenantId = _a.tenantId, domain = _a.domain, userAgent = _a.userAgent;
                userIp = req.ip || req.connection.remoteAddress;
                if (!tenantId) {
                    return [2 /*return*/, res.status(400).json({ error: 'Tenant ID is required' })];
                }
                return [4 /*yield*/, database_1.database.get('SELECT id FROM tenants WHERE id = ?', [tenantId])];
            case 1:
                tenant = _b.sent();
                if (!tenant) {
                    return [2 /*return*/, res.status(404).json({ error: 'Tenant not found' })];
                }
                sessionToken = (0, uuid_1.v4)();
                return [4 /*yield*/, database_1.database.run('INSERT INTO chat_sessions (tenant_id, domain, user_ip, user_agent, session_token) VALUES (?, ?, ?, ?, ?)', [tenantId, domain, userIp, userAgent, sessionToken])];
            case 2:
                result = _b.sent();
                // Log analytics event
                return [4 /*yield*/, database_1.database.run('INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)', [tenantId, 'chat_session_started', JSON.stringify({ sessionId: result.lastID, domain: domain })])];
            case 3:
                // Log analytics event
                _b.sent();
                res.status(201).json({
                    sessionId: result.lastID,
                    sessionToken: sessionToken,
                    message: 'Chat session created successfully'
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error('Create session error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Send a message and get AI response
router.post('/messages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, sessionToken, message, tenantId, session, chatHistory, knowledgeBase, mcpResponse, aiResponse, mcpError_1, fallbackResponse, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 12, , 13]);
                _a = req.body, sessionToken = _a.sessionToken, message = _a.message, tenantId = _a.tenantId;
                if (!sessionToken || !message || !tenantId) {
                    return [2 /*return*/, res.status(400).json({ error: 'Session token, message, and tenant ID are required' })];
                }
                return [4 /*yield*/, database_1.database.get('SELECT * FROM chat_sessions WHERE session_token = ? AND tenant_id = ?', [sessionToken, tenantId])];
            case 1:
                session = _b.sent();
                if (!session) {
                    return [2 /*return*/, res.status(404).json({ error: 'Chat session not found' })];
                }
                // Save user message
                return [4 /*yield*/, database_1.database.run('INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)', [session.id, 'user', message])];
            case 2:
                // Save user message
                _b.sent();
                return [4 /*yield*/, database_1.database.query('SELECT sender, message, timestamp FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC', [session.id])];
            case 3:
                chatHistory = _b.sent();
                return [4 /*yield*/, database_1.database.query('SELECT name, type, source FROM knowledge_base WHERE tenant_id = ? AND status = "active"', [tenantId])];
            case 4:
                knowledgeBase = _b.sent();
                _b.label = 5;
            case 5:
                _b.trys.push([5, 9, , 11]);
                return [4 /*yield*/, axios_1.default.post("".concat(process.env.MCP_SERVER_URL, "/chat"), {
                        message: message,
                        history: chatHistory,
                        knowledge_base: knowledgeBase,
                        tenant_id: tenantId
                    }, {
                        headers: {
                            'Authorization': "Bearer ".concat(process.env.MCP_AUTH_TOKEN),
                            'Content-Type': 'application/json'
                        },
                        timeout: 30000 // 30 second timeout
                    })];
            case 6:
                mcpResponse = _b.sent();
                aiResponse = mcpResponse.data.response || 'I apologize, but I encountered an issue processing your request.';
                // Save AI response
                return [4 /*yield*/, database_1.database.run('INSERT INTO chat_messages (session_id, sender, message, metadata) VALUES (?, ?, ?, ?)', [session.id, 'ai', aiResponse, JSON.stringify({
                            model: mcpResponse.data.model || 'gemini-1.5-flash',
                            confidence: mcpResponse.data.confidence || 0.8
                        })])];
            case 7:
                // Save AI response
                _b.sent();
                // Log analytics event
                return [4 /*yield*/, database_1.database.run('INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)', [tenantId, 'message_sent', JSON.stringify({
                            sessionId: session.id,
                            messageLength: message.length,
                            responseLength: aiResponse.length
                        })])];
            case 8:
                // Log analytics event
                _b.sent();
                res.json({
                    response: aiResponse,
                    messageId: session.id,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 11];
            case 9:
                mcpError_1 = _b.sent();
                console.error('MCP Server error:', mcpError_1);
                fallbackResponse = "I'm sorry, but I'm experiencing technical difficulties at the moment. Please try again in a few minutes or contact support if the issue persists.";
                return [4 /*yield*/, database_1.database.run('INSERT INTO chat_messages (session_id, sender, message, metadata) VALUES (?, ?, ?, ?)', [session.id, 'ai', fallbackResponse, JSON.stringify({ error: 'mcp_server_unavailable' })])];
            case 10:
                _b.sent();
                res.json({
                    response: fallbackResponse,
                    messageId: session.id,
                    timestamp: new Date().toISOString(),
                    error: 'Service temporarily unavailable'
                });
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 13];
            case 12:
                error_2 = _b.sent();
                console.error('Send message error:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
// Get chat history
router.get('/sessions/:sessionToken/history', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionToken, tenantId, session, messages, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                sessionToken = req.params.sessionToken;
                tenantId = req.query.tenantId;
                if (!tenantId) {
                    return [2 /*return*/, res.status(400).json({ error: 'Tenant ID is required' })];
                }
                return [4 /*yield*/, database_1.database.get('SELECT * FROM chat_sessions WHERE session_token = ? AND tenant_id = ?', [sessionToken, tenantId])];
            case 1:
                session = _a.sent();
                if (!session) {
                    return [2 /*return*/, res.status(404).json({ error: 'Chat session not found' })];
                }
                return [4 /*yield*/, database_1.database.query('SELECT sender, message, metadata, timestamp FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC', [session.id])];
            case 2:
                messages = _a.sent();
                res.json({
                    sessionId: session.id,
                    messages: messages,
                    session: {
                        started_at: session.started_at,
                        resolved: session.resolved,
                        rating: session.rating
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Get history error:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Rate conversation
router.post('/sessions/:sessionToken/rate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionToken, _a, rating, feedback, tenantId, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                sessionToken = req.params.sessionToken;
                _a = req.body, rating = _a.rating, feedback = _a.feedback, tenantId = _a.tenantId;
                if (!tenantId || rating === undefined) {
                    return [2 /*return*/, res.status(400).json({ error: 'Tenant ID and rating are required' })];
                }
                if (rating < 1 || rating > 5) {
                    return [2 /*return*/, res.status(400).json({ error: 'Rating must be between 1 and 5' })];
                }
                // Update session
                return [4 /*yield*/, database_1.database.run('UPDATE chat_sessions SET rating = ?, feedback = ?, resolved = TRUE WHERE session_token = ? AND tenant_id = ?', [rating, feedback, sessionToken, tenantId])];
            case 1:
                // Update session
                _b.sent();
                // Log analytics event
                return [4 /*yield*/, database_1.database.run('INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)', [tenantId, 'conversation_rated', JSON.stringify({
                            sessionToken: sessionToken,
                            rating: rating,
                            hasFeedback: !!feedback
                        })])];
            case 2:
                // Log analytics event
                _b.sent();
                res.json({ message: 'Rating submitted successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error('Rate conversation error:', error_4);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// End chat session
router.post('/sessions/:sessionToken/end', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionToken, tenantId, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                sessionToken = req.params.sessionToken;
                tenantId = req.body.tenantId;
                if (!tenantId) {
                    return [2 /*return*/, res.status(400).json({ error: 'Tenant ID is required' })];
                }
                // Update session
                return [4 /*yield*/, database_1.database.run('UPDATE chat_sessions SET ended_at = CURRENT_TIMESTAMP WHERE session_token = ? AND tenant_id = ?', [sessionToken, tenantId])];
            case 1:
                // Update session
                _a.sent();
                // Log analytics event
                return [4 /*yield*/, database_1.database.run('INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)', [tenantId, 'chat_session_ended', JSON.stringify({ sessionToken: sessionToken })])];
            case 2:
                // Log analytics event
                _a.sent();
                res.json({ message: 'Chat session ended successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('End session error:', error_5);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
