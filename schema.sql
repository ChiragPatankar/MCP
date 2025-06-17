-- MCP Chat Support Platform Database Schema
-- SQLite Database Schema for Multi-Tenant Customer Support Bot Platform

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Tenants table (companies using the platform)
CREATE TABLE tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    domain TEXT,
    api_key TEXT UNIQUE,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
    settings TEXT DEFAULT '{}', -- JSON settings
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users table (tenant admins and staff)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'agent', 'viewer')),
    first_name TEXT,
    last_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

-- Chat sessions
CREATE TABLE chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_token TEXT UNIQUE NOT NULL,
    tenant_id INTEGER NOT NULL,
    visitor_id TEXT, -- For tracking returning visitors
    ip_address TEXT,
    user_agent TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    resolved BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    tags TEXT, -- JSON array of tags
    assigned_agent_id INTEGER,
    source TEXT DEFAULT 'widget' CHECK (source IN ('widget', 'dashboard', 'api')),
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_agent_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Chat messages
CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'agent')),
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    metadata TEXT DEFAULT '{}', -- JSON metadata
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE CASCADE
);

-- Knowledge base for AI context
CREATE TABLE knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    keywords TEXT, -- Space-separated keywords for search
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    priority INTEGER DEFAULT 0, -- Higher priority = more relevant
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

-- Analytics events for tracking
CREATE TABLE analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    event_data TEXT DEFAULT '{}', -- JSON event data
    session_id INTEGER,
    user_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Widget customization settings
CREATE TABLE widget_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL UNIQUE,
    primary_color TEXT DEFAULT '#3B82F6',
    secondary_color TEXT DEFAULT '#6B7280',
    welcome_message TEXT DEFAULT 'Hi! How can I help you today?',
    offline_message TEXT DEFAULT 'We are currently offline. Please leave a message.',
    position TEXT DEFAULT 'bottom-right' CHECK (position IN ('bottom-right', 'bottom-left', 'top-right', 'top-left')),
    enabled BOOLEAN DEFAULT TRUE,
    show_agent_photos BOOLEAN DEFAULT TRUE,
    collect_visitor_info BOOLEAN DEFAULT FALSE,
    business_hours TEXT DEFAULT '{}', -- JSON business hours
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

-- Automated responses and triggers
CREATE TABLE auto_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('keyword', 'intent', 'time_based', 'page_url')),
    trigger_value TEXT NOT NULL,
    response_message TEXT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Chat sessions indexes
CREATE INDEX idx_chat_sessions_tenant_id ON chat_sessions(tenant_id);
CREATE INDEX idx_chat_sessions_started_at ON chat_sessions(started_at);
CREATE INDEX idx_chat_sessions_session_token ON chat_sessions(session_token);
CREATE INDEX idx_chat_sessions_resolved ON chat_sessions(resolved);

-- Chat messages indexes
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender);

-- Users indexes
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- Knowledge base indexes
CREATE INDEX idx_knowledge_base_tenant_id ON knowledge_base(tenant_id);
CREATE INDEX idx_knowledge_base_status ON knowledge_base(status);
CREATE INDEX idx_knowledge_base_keywords ON knowledge_base(keywords);

-- Analytics events indexes
CREATE INDEX idx_analytics_events_tenant_id ON analytics_events(tenant_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update timestamps on record changes
CREATE TRIGGER update_tenants_timestamp 
    AFTER UPDATE ON tenants
    BEGIN
        UPDATE tenants SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_knowledge_base_timestamp 
    AFTER UPDATE ON knowledge_base
    BEGIN
        UPDATE knowledge_base SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_widget_settings_timestamp 
    AFTER UPDATE ON widget_settings
    BEGIN
        UPDATE widget_settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- ============================================================================
-- SAMPLE DATA FOR TESTING AND DEMO
-- ============================================================================

-- Insert sample tenant
INSERT INTO tenants (id, name, domain, api_key, plan, status) VALUES 
(1, 'Demo Company', 'demo.example.com', 'demo_api_key_123', 'pro', 'active');

-- Insert sample admin user (password: 'password123' - bcrypt hash)
INSERT INTO users (id, email, password_hash, tenant_id, role, first_name, last_name) VALUES 
(1, 'admin@demo.com', '$2b$10$rOzJqPOkpVqElCkqeH5pMuX3r8fGPGXGGf8bO9wKAYf8Y9zKjXKqm', 1, 'admin', 'Demo', 'Admin');

-- Insert default widget settings
INSERT INTO widget_settings (tenant_id, welcome_message, primary_color) VALUES 
(1, 'Welcome to Demo Company! How can we help you today?', '#3B82F6');

-- Insert sample knowledge base articles
INSERT INTO knowledge_base (tenant_id, title, content, category, keywords, created_by) VALUES 
(1, 'Getting Started Guide', 'Welcome to our platform! Here''s how to get started with our customer support system...', 'Documentation', 'getting started guide tutorial setup', 1),
(1, 'Billing Information', 'Information about billing, pricing plans, and payment methods...', 'Billing', 'billing payment pricing plans subscription', 1),
(1, 'Technical Support', 'Common technical issues and their solutions...', 'Support', 'technical support troubleshooting issues problems', 1),
(1, 'Account Management', 'How to manage your account settings, users, and preferences...', 'Account', 'account settings users management profile', 1);

-- Insert sample auto responses
INSERT INTO auto_responses (tenant_id, trigger_type, trigger_value, response_message, priority) VALUES 
(1, 'keyword', 'hello hi hey', 'Hello! Welcome to Demo Company. How can I assist you today?', 10),
(1, 'keyword', 'pricing price cost', 'I''d be happy to help you with pricing information. You can view our plans at our pricing page or I can connect you with our sales team.', 8),
(1, 'keyword', 'technical support help', 'I''m here to help with technical issues. Can you please describe the problem you''re experiencing?', 9);

-- Insert sample chat session for demo
INSERT INTO chat_sessions (id, session_token, tenant_id, started_at, resolved, rating) VALUES 
(1, 'demo_session_001', 1, datetime('now', '-2 hours'), 1, 5);

-- Insert sample messages
INSERT INTO chat_messages (session_id, sender, message, timestamp) VALUES 
(1, 'user', 'Hi, I need help with setting up my account', datetime('now', '-2 hours')),
(1, 'assistant', 'Hello! I''d be happy to help you set up your account. What specific aspect would you like assistance with?', datetime('now', '-2 hours', '+1 minute')),
(1, 'user', 'I''m having trouble with the billing setup', datetime('now', '-2 hours', '+2 minutes')),
(1, 'assistant', 'I can help you with billing setup. Let me guide you through the process step by step...', datetime('now', '-2 hours', '+3 minutes'));

-- Insert sample analytics events
INSERT INTO analytics_events (tenant_id, event_type, event_data, session_id, timestamp) VALUES 
(1, 'session_started', '{"source": "widget", "page": "/pricing"}', 1, datetime('now', '-2 hours')),
(1, 'message_sent', '{"message_count": 1, "sender": "user"}', 1, datetime('now', '-2 hours')),
(1, 'session_resolved', '{"resolution_time": 300, "rating": 5}', 1, datetime('now', '-1 hour'));

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Dashboard metrics view
CREATE VIEW dashboard_metrics AS
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    COUNT(DISTINCT cs.id) as total_conversations,
    COUNT(DISTINCT CASE WHEN cs.started_at >= date('now', 'start of month') THEN cs.id END) as monthly_conversations,
    AVG(cs.rating) as average_rating,
    (COUNT(CASE WHEN cs.resolved = 1 THEN 1 END) * 100.0 / COUNT(cs.id)) as resolution_rate,
    COUNT(DISTINCT kb.id) as knowledge_base_count
FROM tenants t
LEFT JOIN chat_sessions cs ON t.id = cs.tenant_id
LEFT JOIN knowledge_base kb ON t.id = kb.tenant_id AND kb.status = 'active'
GROUP BY t.id, t.name;

-- Recent conversations view
CREATE VIEW recent_conversations AS
SELECT 
    cs.id,
    cs.session_token,
    cs.tenant_id,
    cs.started_at,
    cs.ended_at,
    cs.resolved,
    cs.rating,
    cs.feedback,
    (SELECT cm.message FROM chat_messages cm WHERE cm.session_id = cs.id AND cm.sender = 'user' ORDER BY cm.timestamp LIMIT 1) as first_message,
    (SELECT COUNT(*) FROM chat_messages cm WHERE cm.session_id = cs.id) as message_count
FROM chat_sessions cs
ORDER BY cs.started_at DESC;

-- ============================================================================
-- FUNCTIONS AND PROCEDURES (SQLite Compatible)
-- ============================================================================

-- Create a simple function to generate session tokens (trigger-based)
CREATE TRIGGER generate_session_token
    AFTER INSERT ON chat_sessions
    WHEN NEW.session_token IS NULL
    BEGIN
        UPDATE chat_sessions 
        SET session_token = 'sess_' || hex(randomblob(16))
        WHERE id = NEW.id;
    END;

-- ============================================================================
-- SECURITY AND CLEANUP
-- ============================================================================

-- Create a cleanup procedure for old data (via scheduled job)
-- Note: This would typically be run via a cron job or scheduled task

-- Example cleanup queries (to be run periodically):
-- DELETE FROM analytics_events WHERE timestamp < date('now', '-90 days');
-- DELETE FROM chat_sessions WHERE ended_at < date('now', '-1 year') AND resolved = 1;

-- ============================================================================
-- FINAL SETUP
-- ============================================================================

-- Analyze tables for better query performance
ANALYZE;

-- Vacuum to optimize database
VACUUM;

-- Final check - ensure all constraints are working
PRAGMA integrity_check;

-- Display schema information
.schema

-- Success message
SELECT 'MCP Chat Support Platform database schema created successfully!' as status; 