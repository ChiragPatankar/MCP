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
// Get widget configuration
router.get('/config/:tenantId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, tenant, config, defaultConfig, widgetConfig, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                tenantId = req.params.tenantId;
                return [4 /*yield*/, database_1.database.get('SELECT id, name, plan FROM tenants WHERE id = ?', [tenantId])];
            case 1:
                tenant = _a.sent();
                if (!tenant) {
                    return [2 /*return*/, res.status(404).json({ error: 'Tenant not found' })];
                }
                return [4 /*yield*/, database_1.database.get('SELECT config FROM widget_configs WHERE tenant_id = ?', [tenantId])];
            case 2:
                config = _a.sent();
                defaultConfig = {
                    theme: {
                        primaryColor: '#6366f1',
                        backgroundColor: '#ffffff',
                        textColor: '#374151',
                        borderRadius: '12px'
                    },
                    position: {
                        bottom: '20px',
                        right: '20px'
                    },
                    size: 'medium',
                    welcome: {
                        title: "Hi! I'm ".concat(tenant.name, "'s AI assistant"),
                        message: 'How can I help you today?',
                        showAvatar: true
                    },
                    features: {
                        fileUpload: false,
                        typing: true,
                        ratings: true
                    }
                };
                widgetConfig = config ? __assign(__assign({}, defaultConfig), JSON.parse(config.config)) :
                    defaultConfig;
                res.json({
                    tenantId: tenantId,
                    config: widgetConfig
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Get widget config error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get widget script
router.get('/script/:tenantId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, tenant, script, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tenantId = req.params.tenantId;
                return [4 /*yield*/, database_1.database.get('SELECT id FROM tenants WHERE id = ?', [tenantId])];
            case 1:
                tenant = _a.sent();
                if (!tenant) {
                    return [2 /*return*/, res.status(404).json({ error: 'Tenant not found' })];
                }
                script = "\n(function() {\n  // MCP Chat Widget\n  const TENANT_ID = '".concat(tenantId, "';\n  const API_URL = '").concat(process.env.FRONTEND_URL || 'http://localhost:3001', "/api';\n  \n  // Create widget container\n  const widget = document.createElement('div');\n  widget.id = 'mcp-chat-widget';\n  widget.style.cssText = `\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n    width: 350px;\n    height: 500px;\n    background: white;\n    border-radius: 12px;\n    box-shadow: 0 10px 25px rgba(0,0,0,0.1);\n    z-index: 10000;\n    display: none;\n    flex-direction: column;\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    border: 1px solid #e5e7eb;\n  `;\n\n  // Create chat button\n  const button = document.createElement('div');\n  button.id = 'mcp-chat-button';\n  button.style.cssText = `\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n    width: 60px;\n    height: 60px;\n    background: linear-gradient(135deg, #6366f1, #8b5cf6);\n    border-radius: 50%;\n    cursor: pointer;\n    z-index: 10001;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);\n    transition: transform 0.2s ease;\n  `;\n  \n  button.innerHTML = `\n    <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\">\n      <path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path>\n    </svg>\n  `;\n\n  button.onmouseover = () => button.style.transform = 'scale(1.05)';\n  button.onmouseout = () => button.style.transform = 'scale(1)';\n\n  // Widget header\n  const header = document.createElement('div');\n  header.style.cssText = `\n    padding: 16px;\n    background: linear-gradient(135deg, #6366f1, #8b5cf6);\n    color: white;\n    border-radius: 12px 12px 0 0;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n  `;\n  \n  header.innerHTML = `\n    <div>\n      <h3 style=\"margin: 0; font-size: 16px; font-weight: 600;\">Chat Support</h3>\n      <p style=\"margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;\">We're here to help!</p>\n    </div>\n    <button id=\"mcp-close-btn\" style=\"background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 4px;\">\u00D7</button>\n  `;\n\n  // Messages container\n  const messages = document.createElement('div');\n  messages.id = 'mcp-messages';\n  messages.style.cssText = `\n    flex: 1;\n    padding: 16px;\n    overflow-y: auto;\n    display: flex;\n    flex-direction: column;\n    gap: 12px;\n  `;\n\n  // Input container\n  const inputContainer = document.createElement('div');\n  inputContainer.style.cssText = `\n    padding: 16px;\n    border-top: 1px solid #e5e7eb;\n    display: flex;\n    gap: 8px;\n  `;\n\n  const input = document.createElement('input');\n  input.type = 'text';\n  input.placeholder = 'Type your message...';\n  input.style.cssText = `\n    flex: 1;\n    padding: 12px;\n    border: 1px solid #d1d5db;\n    border-radius: 8px;\n    outline: none;\n    font-size: 14px;\n  `;\n\n  const sendBtn = document.createElement('button');\n  sendBtn.textContent = 'Send';\n  sendBtn.style.cssText = `\n    padding: 12px 16px;\n    background: #6366f1;\n    color: white;\n    border: none;\n    border-radius: 8px;\n    cursor: pointer;\n    font-size: 14px;\n    font-weight: 500;\n  `;\n\n  // Assemble widget\n  inputContainer.appendChild(input);\n  inputContainer.appendChild(sendBtn);\n  widget.appendChild(header);\n  widget.appendChild(messages);\n  widget.appendChild(inputContainer);\n\n  // Add to page\n  document.body.appendChild(button);\n  document.body.appendChild(widget);\n\n  // Session management\n  let sessionToken = null;\n  let isVisible = false;\n\n  // Toggle widget\n  function toggleWidget() {\n    isVisible = !isVisible;\n    widget.style.display = isVisible ? 'flex' : 'none';\n    button.style.display = isVisible ? 'none' : 'flex';\n    \n    if (isVisible && !sessionToken) {\n      initializeSession();\n    }\n  }\n\n  // Initialize chat session\n  async function initializeSession() {\n    try {\n      const response = await fetch(`${API_URL}/chat/sessions`, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          tenantId: TENANT_ID,\n          domain: window.location.hostname,\n          userAgent: navigator.userAgent\n        })\n      });\n      \n      const data = await response.json();\n      sessionToken = data.sessionToken;\n      \n      // Add welcome message\n      addMessage('ai', 'Hello! How can I help you today?');\n    } catch (error) {\n      console.error('Failed to initialize session:', error);\n      addMessage('ai', 'Sorry, I\\'m having trouble connecting. Please try again later.');\n    }\n  }\n\n  // Send message\n  async function sendMessage(message) {\n    if (!sessionToken || !message.trim()) return;\n\n    addMessage('user', message);\n    input.value = '';\n    \n    // Show typing indicator\n    const typingEl = addMessage('ai', 'Typing...', true);\n    \n    try {\n      const response = await fetch(`${API_URL}/chat/messages`, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          sessionToken,\n          message,\n          tenantId: TENANT_ID\n        })\n      });\n      \n      const data = await response.json();\n      \n      // Remove typing indicator\n      typingEl.remove();\n      \n      // Add AI response\n      addMessage('ai', data.response);\n      \n    } catch (error) {\n      typingEl.remove();\n      addMessage('ai', 'Sorry, I encountered an error. Please try again.');\n    }\n  }\n\n  // Add message to chat\n  function addMessage(sender, text, isTyping = false) {\n    const messageEl = document.createElement('div');\n    messageEl.style.cssText = `\n      max-width: 80%;\n      padding: 12px 16px;\n      border-radius: 18px;\n      font-size: 14px;\n      line-height: 1.4;\n      ${sender === 'user' ? \n        'background: #6366f1; color: white; align-self: flex-end; margin-left: auto;' : \n        'background: #f3f4f6; color: #374151; align-self: flex-start;'\n      }\n      ${isTyping ? 'opacity: 0.7; font-style: italic;' : ''}\n    `;\n    \n    messageEl.textContent = text;\n    messages.appendChild(messageEl);\n    messages.scrollTop = messages.scrollHeight;\n    \n    return messageEl;\n  }\n\n  // Event listeners\n  button.onclick = toggleWidget;\n  header.querySelector('#mcp-close-btn').onclick = toggleWidget;\n  sendBtn.onclick = () => sendMessage(input.value);\n  input.onkeypress = (e) => {\n    if (e.key === 'Enter') sendMessage(input.value);\n  };\n\n  console.log('MCP Chat Widget loaded successfully');\n})();\n");
                res.setHeader('Content-Type', 'application/javascript');
                res.send(script);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Get widget script error:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
