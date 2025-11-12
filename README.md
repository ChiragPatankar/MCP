# MCP Chat Support System

A comprehensive chat support system with React frontend and Node.js backend, featuring real-time messaging, knowledge base management, and multi-tenant architecture.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Responsive design with mobile optimization
- **Real-time Chat**: WebSocket-based live messaging
- **Authentication**: Google OAuth integration
- **Demo Mode**: Interactive demo with simulated features
- **Payment Integration**: Stripe payment processing
- **Video Calls**: WebRTC video conferencing
- **Knowledge Base**: Searchable documentation system
- **Admin Dashboard**: Multi-tenant management interface
- **Offline Support**: Service worker for offline functionality

### Backend (Node.js + TypeScript)
- **RESTful API**: Express.js server with TypeScript
- **WebSocket Server**: Real-time communication
- **Database**: SQLite with TypeORM
- **Authentication**: JWT token-based auth
- **Multi-tenancy**: Tenant isolation and management
- **File Upload**: Secure file handling
- **Analytics**: Usage tracking and reporting
- **Widget System**: Embeddable chat widgets

## 📁 Project Structure

```
project/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   └── db/            # Database models
│   ├── package.json
│   └── tsconfig.json
├── gemini-mcp-server/     # Gemini MCP integration
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Socket.io Client** for real-time features
- **Stripe** for payments
- **WebRTC** for video calls

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **Socket.io** for WebSocket server
- **SQLite** database with TypeORM
- **JWT** for authentication
- **Multer** for file uploads
- **Cors** for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=sqlite:./database.sqlite

# JWT Secret
JWT_SECRET=your-jwt-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# File Upload
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=5242880
```

## 📱 Features Overview

### Chat Interface
- Real-time messaging with typing indicators
- File sharing and image uploads
- Message history and search
- Read receipts and delivery status

### Knowledge Base
- Searchable documentation
- Category organization
- Rich text editing
- Version control

### Admin Dashboard
- Multi-tenant management
- User analytics and reporting
- System configuration
- Widget customization

### Widget System
- Embeddable chat widgets
- Customizable appearance
- Multi-language support
- Mobile responsive

## 🔧 Development

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

### Testing
```bash
# Run frontend tests
npm test

# Run backend tests
cd server && npm test
```

### Database Migrations
```bash
cd server
npm run migration:generate
npm run migration:run
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Render/Railway)
```bash
cd server
npm run build
npm start
```

### Gemini MCP Server (Hugging Face Spaces)

The Gemini MCP Server can be deployed to Hugging Face Spaces for free:

**📖 For detailed deployment instructions, see: [`gemini-mcp-server/README_HF_SPACES.md`](gemini-mcp-server/README_HF_SPACES.md)**

**Quick Steps:**
1. Get a free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new Space on [Hugging Face Spaces](https://huggingface.co/spaces)
3. Choose "Docker" as the SDK
4. Connect your GitHub repository
5. Set the `GEMINI_API_KEY` environment variable
6. Deploy!

**Cost:** $0 (free tier available for both Hugging Face Spaces and Google Gemini API)

### Node.js Backend (Hugging Face Spaces)

The Node.js/Express backend can also be deployed to Hugging Face Spaces:

**📖 For detailed deployment instructions, see: [`server/README_HF_SPACES.md`](server/README_HF_SPACES.md)**

**Quick Steps:**
1. Create a new Space on [Hugging Face Spaces](https://huggingface.co/spaces)
2. Choose "Docker" as the SDK
3. Connect your GitHub repository
4. Set the `JWT_SECRET` environment variable
5. Deploy!

**Cost:** $0 (free tier available for Hugging Face Spaces)

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/profile` - Get user profile

### Chat Endpoints
- `GET /api/chat/messages` - Get chat history
- `POST /api/chat/messages` - Send message
- `GET /api/chat/rooms` - Get chat rooms

### Knowledge Base Endpoints
- `GET /api/knowledge` - Get knowledge articles
- `POST /api/knowledge` - Create article
- `PUT /api/knowledge/:id` - Update article
- `DELETE /api/knowledge/:id` - Delete article

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the deployment guides

## 🔗 Links

- [Live Demo](https://your-demo-url.com)
- [API Documentation](https://your-api-docs.com)
- [Deployment Guide](DEPLOYMENT.md)

---

Made with ❤️ by Chirag 
