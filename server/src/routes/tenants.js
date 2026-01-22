"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var database_1 = require("../db/database");
var router = express_1.default.Router();
// Get current tenant info
router.get('/me', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, tenant, domains, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                tenantId = req.user.tenantId;
                return [4 /*yield*/, database_1.database.get('SELECT id, name, subdomain, plan, settings, created_at FROM tenants WHERE id = ?', [tenantId])];
            case 1:
                tenant = _a.sent();
                if (!tenant) {
                    return [2 /*return*/, res.status(404).json({ error: 'Tenant not found' })];
                }
                return [4 /*yield*/, database_1.database.query('SELECT id, domain, verified, created_at FROM domains WHERE tenant_id = ?', [tenantId])];
            case 2:
                domains = _a.sent();
                res.json(__assign(__assign({}, tenant), { settings: JSON.parse(tenant.settings || '{}'), domains: domains }));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Get tenant error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update tenant settings
router.put('/me', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, _a, name_1, settings, updates, params, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                tenantId = req.user.tenantId;
                _a = req.body, name_1 = _a.name, settings = _a.settings;
                updates = [];
                params = [];
                if (name_1) {
                    updates.push('name = ?');
                    params.push(name_1);
                }
                if (settings) {
                    updates.push('settings = ?');
                    params.push(JSON.stringify(settings));
                }
                if (updates.length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'No valid fields to update' })];
                }
                updates.push('updated_at = CURRENT_TIMESTAMP');
                params.push(tenantId);
                return [4 /*yield*/, database_1.database.run("UPDATE tenants SET ".concat(updates.join(', '), " WHERE id = ?"), params)];
            case 1:
                _b.sent();
                res.json({ message: 'Tenant updated successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Update tenant error:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Add domain
router.post('/domains', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, domain, existingDomain, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                tenantId = req.user.tenantId;
                domain = req.body.domain;
                if (!domain) {
                    return [2 /*return*/, res.status(400).json({ error: 'Domain is required' })];
                }
                return [4 /*yield*/, database_1.database.get('SELECT id FROM domains WHERE domain = ?', [domain])];
            case 1:
                existingDomain = _a.sent();
                if (existingDomain) {
                    return [2 /*return*/, res.status(400).json({ error: 'Domain already exists' })];
                }
                return [4 /*yield*/, database_1.database.run('INSERT INTO domains (tenant_id, domain) VALUES (?, ?)', [tenantId, domain])];
            case 2:
                result = _a.sent();
                res.status(201).json({
                    id: result.lastID,
                    domain: domain,
                    verified: false,
                    message: 'Domain added successfully'
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Add domain error:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Remove domain
router.delete('/domains/:domainId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, domainId, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tenantId = req.user.tenantId;
                domainId = req.params.domainId;
                return [4 /*yield*/, database_1.database.run('DELETE FROM domains WHERE id = ? AND tenant_id = ?', [domainId, tenantId])];
            case 1:
                _a.sent();
                res.json({ message: 'Domain removed successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Remove domain error:', error_4);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get tenant analytics summary
router.get('/analytics/summary', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, totalConversations, totalMessages, avgRating, knowledgeBaseCount, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                tenantId = req.user.tenantId;
                return [4 /*yield*/, database_1.database.get('SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ?', [tenantId])];
            case 1:
                totalConversations = _a.sent();
                return [4 /*yield*/, database_1.database.get('SELECT COUNT(*) as count FROM chat_messages cm JOIN chat_sessions cs ON cm.session_id = cs.id WHERE cs.tenant_id = ?', [tenantId])];
            case 2:
                totalMessages = _a.sent();
                return [4 /*yield*/, database_1.database.get('SELECT AVG(rating) as avg FROM chat_sessions WHERE tenant_id = ? AND rating IS NOT NULL', [tenantId])];
            case 3:
                avgRating = _a.sent();
                return [4 /*yield*/, database_1.database.get('SELECT COUNT(*) as count FROM knowledge_base WHERE tenant_id = ?', [tenantId])];
            case 4:
                knowledgeBaseCount = _a.sent();
                res.json({
                    totalConversations: totalConversations.count,
                    totalMessages: totalMessages.count,
                    averageRating: avgRating.avg || 0,
                    knowledgeBaseDocuments: knowledgeBaseCount.count
                });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                console.error('Get analytics summary error:', error_5);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
