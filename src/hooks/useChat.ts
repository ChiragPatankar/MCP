import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Tables, InsertDto } from '../lib/supabase'

type ChatMessage = Tables<'chat_messages'>

export function useChat(tenantId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial messages
  useEffect(() => {
    fetchMessages()
  }, [tenantId])

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as ChatMessage])
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? payload.new as ChatMessage : msg
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => 
              prev.filter(msg => msg.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [tenantId])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: true })

      if (error) {
        setError(error.message)
        return
      }

      setMessages(data || [])
    } catch (err) {
      setError('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (message: string, userId: string, context?: any) => {
    try {
      const newMessage: InsertDto<'chat_messages'> = {
        user_id: userId,
        tenant_id: tenantId,
        message,
        context,
        message_type: 'text',
        status: 'sent'
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(newMessage)
        .select()
        .single()

      if (error) {
        setError(error.message)
        return { error }
      }

      return { data }
    } catch (err) {
      setError('Failed to send message')
      return { error: err }
    }
  }

  const updateMessageStatus = async (messageId: string, status: 'sent' | 'delivered' | 'read') => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ status })
        .eq('id', messageId)

      if (error) {
        setError(error.message)
        return { error }
      }

      return { success: true }
    } catch (err) {
      setError('Failed to update message status')
      return { error: err }
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)

      if (error) {
        setError(error.message)
        return { error }
      }

      return { success: true }
    } catch (err) {
      setError('Failed to delete message')
      return { error: err }
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    updateMessageStatus,
    deleteMessage,
    refetch: fetchMessages
  }
} 