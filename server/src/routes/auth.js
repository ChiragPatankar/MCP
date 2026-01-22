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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var uuid_1 = require("uuid");
var google_auth_library_1 = require("google-auth-library");
var database_1 = require("../db/database");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
var client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Sign up with email/password
router.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, name_1, existingUser, saltRounds, passwordHash, verificationToken, result, tenantResult, token, user, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, email = _a.email, password = _a.password, name_1 = _a.name;
                // Validation
                if (!email || !password || !name_1) {
                    return [2 /*return*/, res.status(400).json({ error: 'Email, password, and name are required' })];
                }
                if (password.length < 6) {
                    return [2 /*return*/, res.status(400).json({ error: 'Password must be at least 6 characters' })];
                }
                return [4 /*yield*/, database_1.database.get('SELECT id FROM users WHERE email = ?', [email])];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ error: 'User already exists' })];
                }
                saltRounds = 10;
                return [4 /*yield*/, bcryptjs_1.default.hash(password, saltRounds)];
            case 2:
                passwordHash = _b.sent();
                verificationToken = (0, uuid_1.v4)();
                return [4 /*yield*/, database_1.database.run('INSERT INTO users (email, name, password_hash, verification_token) VALUES (?, ?, ?, ?)', [email, name_1, passwordHash, verificationToken])];
            case 3:
                result = _b.sent();
                return [4 /*yield*/, database_1.database.run('INSERT INTO tenants (name, subdomain) VALUES (?, ?)', ["".concat(name_1, "'s Workspace"), "tenant-".concat(result.lastID)])];
            case 4:
                tenantResult = _b.sent();
                // Link user to tenant
                return [4 /*yield*/, database_1.database.run('INSERT INTO user_tenants (user_id, tenant_id, role) VALUES (?, ?, ?)', [result.lastID, tenantResult.lastID, 'owner'])];
            case 5:
                // Link user to tenant
                _b.sent();
                token = jsonwebtoken_1.default.sign({ userId: result.lastID, tenantId: tenantResult.lastID }, process.env.JWT_SECRET, { expiresIn: '7d' });
                return [4 /*yield*/, database_1.database.get('SELECT id, email, name, avatar, created_at FROM users WHERE id = ?', [result.lastID])];
            case 6:
                user = _b.sent();
                res.status(201).json({
                    message: 'User created successfully',
                    token: token,
                    user: user,
                    tenant: { id: tenantResult.lastID, name: "".concat(name_1, "'s Workspace") }
                });
                return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                console.error('Signup error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// Sign in with email/password
router.post('/signin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isValidPassword, userTenant, token, password_hash, verification_token, safeUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json({ error: 'Email and password are required' })];
                }
                return [4 /*yield*/, database_1.database.get('SELECT * FROM users WHERE email = ?', [email])];
            case 1:
                user = _b.sent();
                if (!user || !user.password_hash) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid credentials' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password_hash)];
            case 2:
                isValidPassword = _b.sent();
                if (!isValidPassword) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid credentials' })];
                }
                return [4 /*yield*/, database_1.database.get("SELECT t.id, t.name, t.subdomain, t.plan \n       FROM tenants t \n       JOIN user_tenants ut ON t.id = ut.tenant_id \n       WHERE ut.user_id = ? AND ut.role = 'owner'", [user.id])];
            case 3:
                userTenant = _b.sent();
                token = jsonwebtoken_1.default.sign({ userId: user.id, tenantId: userTenant === null || userTenant === void 0 ? void 0 : userTenant.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                password_hash = user.password_hash, verification_token = user.verification_token, safeUser = __rest(user, ["password_hash", "verification_token"]);
                res.json({
                    message: 'Signed in successfully',
                    token: token,
                    user: safeUser,
                    tenant: userTenant
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error('Signin error:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Google OAuth
router.post('/google', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var credential, ticket, payload, googleId, email, name_2, picture, user, result, tenantResult, userTenant, token, password_hash, verification_token, safeUser, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                credential = req.body.credential;
                if (!credential) {
                    return [2 /*return*/, res.status(400).json({ error: 'Google credential is required' })];
                }
                return [4 /*yield*/, client.verifyIdToken({
                        idToken: credential,
                        audience: process.env.GOOGLE_CLIENT_ID,
                    })];
            case 1:
                ticket = _a.sent();
                payload = ticket.getPayload();
                if (!payload) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid Google token' })];
                }
                googleId = payload.sub, email = payload.email, name_2 = payload.name, picture = payload.picture;
                return [4 /*yield*/, database_1.database.get('SELECT * FROM users WHERE google_id = ? OR email = ?', [googleId, email])];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 5];
                if (!!user.google_id) return [3 /*break*/, 4];
                return [4 /*yield*/, database_1.database.run('UPDATE users SET google_id = ?, avatar = ? WHERE id = ?', [googleId, picture, user.id])];
            case 3:
                _a.sent();
                user.google_id = googleId;
                user.avatar = picture;
                _a.label = 4;
            case 4: return [3 /*break*/, 9];
            case 5: return [4 /*yield*/, database_1.database.run('INSERT INTO users (email, name, google_id, avatar, email_verified) VALUES (?, ?, ?, ?, ?)', [email, name_2, googleId, picture, true])];
            case 6:
                result = _a.sent();
                return [4 /*yield*/, database_1.database.run('INSERT INTO tenants (name, subdomain) VALUES (?, ?)', ["".concat(name_2, "'s Workspace"), "tenant-".concat(result.lastID)])];
            case 7:
                tenantResult = _a.sent();
                // Link user to tenant
                return [4 /*yield*/, database_1.database.run('INSERT INTO user_tenants (user_id, tenant_id, role) VALUES (?, ?, ?)', [result.lastID, tenantResult.lastID, 'owner'])];
            case 8:
                // Link user to tenant
                _a.sent();
                user = {
                    id: result.lastID,
                    email: email,
                    name: name_2,
                    google_id: googleId,
                    avatar: picture,
                    email_verified: true
                };
                _a.label = 9;
            case 9: return [4 /*yield*/, database_1.database.get("SELECT t.id, t.name, t.subdomain, t.plan \n       FROM tenants t \n       JOIN user_tenants ut ON t.id = ut.tenant_id \n       WHERE ut.user_id = ? AND ut.role = 'owner'", [user.id])];
            case 10:
                userTenant = _a.sent();
                token = jsonwebtoken_1.default.sign({ userId: user.id, tenantId: userTenant === null || userTenant === void 0 ? void 0 : userTenant.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                password_hash = user.password_hash, verification_token = user.verification_token, safeUser = __rest(user, ["password_hash", "verification_token"]);
                res.json({
                    message: 'Google authentication successful',
                    token: token,
                    user: safeUser,
                    tenant: userTenant
                });
                return [3 /*break*/, 12];
            case 11:
                error_3 = _a.sent();
                console.error('Google auth error:', error_3);
                res.status(500).json({ error: 'Google authentication failed' });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
// Get current user
router.get('/me', auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, tenantId, user, tenant, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.user, userId = _a.userId, tenantId = _a.tenantId;
                return [4 /*yield*/, database_1.database.get('SELECT id, email, name, avatar, email_verified, created_at FROM users WHERE id = ?', [userId])];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                return [4 /*yield*/, database_1.database.get('SELECT id, name, subdomain, plan, settings FROM tenants WHERE id = ?', [tenantId])];
            case 2:
                tenant = _b.sent();
                res.json({
                    user: user,
                    tenant: tenant
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error('Get user error:', error_4);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update user profile
router.put('/profile', auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_3, avatar, updates, params, user, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = req.user.userId;
                _a = req.body, name_3 = _a.name, avatar = _a.avatar;
                updates = [];
                params = [];
                if (name_3) {
                    updates.push('name = ?');
                    params.push(name_3);
                }
                if (avatar) {
                    updates.push('avatar = ?');
                    params.push(avatar);
                }
                if (updates.length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'No valid fields to update' })];
                }
                updates.push('updated_at = CURRENT_TIMESTAMP');
                params.push(userId);
                return [4 /*yield*/, database_1.database.run("UPDATE users SET ".concat(updates.join(', '), " WHERE id = ?"), params)];
            case 1:
                _b.sent();
                return [4 /*yield*/, database_1.database.get('SELECT id, email, name, avatar, email_verified, created_at FROM users WHERE id = ?', [userId])];
            case 2:
                user = _b.sent();
                res.json({
                    message: 'Profile updated successfully',
                    user: user
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error('Update profile error:', error_5);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Logout (client-side token removal, but we can blacklist if needed)
router.post('/logout', auth_1.authenticateToken, function (req, res) {
    res.json({ message: 'Logged out successfully' });
});
exports.default = router;
