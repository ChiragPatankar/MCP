import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  PORT: process.env.PORT || 7860, // Hugging Face Spaces default port
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite:./database.sqlite',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  
  // Stripe Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  
  // File Upload Configuration
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  
  // CORS Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend-domain.com'
  ],
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // RAG Backend (FastAPI) Configuration
  // Node backend orchestrates sessions/messages; RAG backend provides AI answers.
  RAG_BACKEND_URL: process.env.RAG_BACKEND_URL,
  RAG_SERVICE_TOKEN: process.env.RAG_SERVICE_TOKEN,
  
  // Validation
  validate() {
    const required = ['JWT_SECRET'];
    const missing = required.filter(key => !this[key as keyof typeof this]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    return true;
  }
};

export default config; 