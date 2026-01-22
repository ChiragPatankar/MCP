export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'tenant';
  createdAt: Date;
};

export type Tenant = {
  id: string;
  name: string;
  logo?: string;
  status: 'active' | 'suspended' | 'pending';
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  createdAt: Date;
  owner: User;
};

export type KnowledgeBase = {
  id: string;
  tenantId: string;
  name: string;
  type: 'pdf' | 'website' | 'text';
  status: 'processing' | 'active' | 'error';
  createdAt: Date;
  updatedAt: Date;
  size?: number;
  source: string;
};

export type ChatConversation = {
  id: string;
  tenantId: string;
  clientId: string;
  startedAt: Date;
  endedAt?: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  resolved: boolean;
  messages: ChatMessage[];
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export type ChatWidget = {
  id: string;
  tenantId: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  position: 'left' | 'right';
  welcomeMessage: string;
  avatar?: string;
  autoOpen: boolean;
};

export type Client = {
  id: string;
  tenantId: string;
  name: string;
  website: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  totalConversations: number;
  resolvedPercentage: number;
};

export type Subscription = {
  id: string;
  tenantId: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
};

export type PlanFeature = {
  name: string;
  included: boolean;
  limit?: number;
};

export type Plan = {
  id: 'free' | 'starter' | 'pro' | 'enterprise';
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: PlanFeature[];
};

export type AnalyticsData = {
  totalConversations: number;
  resolvedConversations: number;
  averageSentiment: number;
  responseTime: number;
  messagesPerConversation: number;
  topQuestions: {question: string, count: number}[];
  conversationsByDay: {date: string, count: number}[];
};