import { createClient } from '@supabase/supabase-js'
import config from '../config'

const supabaseUrl = config.SUPABASE_URL
const supabaseServiceKey = config.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Create public client for user operations
export const supabasePublic = createClient(
  supabaseUrl, 
  config.SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
)

// Database types (same as frontend)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'agent'
          tenant_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'agent'
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'agent'
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          id: string
          name: string
          domain: string | null
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string | null
          tenant_id: string | null
          message: string
          response: string | null
          context: any
          message_type: 'text' | 'file' | 'image'
          status: 'sent' | 'delivered' | 'read'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          tenant_id?: string | null
          message: string
          response?: string | null
          context?: any
          message_type?: 'text' | 'file' | 'image'
          status?: 'sent' | 'delivered' | 'read'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          tenant_id?: string | null
          message?: string
          response?: string | null
          context?: any
          message_type?: 'text' | 'file' | 'image'
          status?: 'sent' | 'delivered' | 'read'
          created_at?: string
        }
      }
      knowledge_base: {
        Row: {
          id: string
          tenant_id: string | null
          title: string
          content: string
          category: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          title: string
          content: string
          category?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          title?: string
          content?: string
          category?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'] 