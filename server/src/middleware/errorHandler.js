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
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var errorHandler = function (error, req, res, next) {
    var statusCode = error.statusCode || 500;
    var message = error.message || 'Internal Server Error';
    // Log error for debugging
    console.error('Error:', error);
    // Don't leak error details in production
    var isDevelopment = process.env.NODE_ENV === 'development';
    res.status(statusCode).json(__assign({ error: message }, (isDevelopment && { stack: error.stack })));
};
exports.errorHandler = errorHandler;
