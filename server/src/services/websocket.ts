import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';

interface ExtendedWebSocket extends WebSocket {
  tenantId?: string;
  sessionToken?: string;
  isAlive?: boolean;
}

export function setupWebSocket(wss: WebSocketServer) {
  const clients = new Map<string, ExtendedWebSocket>();

  wss.on('connection', (ws: ExtendedWebSocket, req: IncomingMessage) => {
    // Parse query parameters
    const query = parse(req.url || '', true).query;
    const tenantId = query.tenantId as string;
    const sessionToken = query.sessionToken as string;

    if (!tenantId || !sessionToken) {
      ws.close(1008, 'Missing tenantId or sessionToken');
      return;
    }

    // Set up connection
    ws.tenantId = tenantId;
    ws.sessionToken = sessionToken;
    ws.isAlive = true;

    // Store client connection
    const clientKey = `${tenantId}:${sessionToken}`;
    clients.set(clientKey, ws);

    console.log(`WebSocket client connected: ${clientKey}`);

    // Handle ping/pong for connection health
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(ws, message);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket client disconnected: ${clientKey}`);
      clients.delete(clientKey);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(clientKey);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to chat server',
      timestamp: new Date().toISOString()
    }));
  });

  // Health check - ping clients every 30 seconds
  const interval = setInterval(() => {
    wss.clients.forEach((ws: ExtendedWebSocket) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  function handleMessage(ws: ExtendedWebSocket, message: any) {
    switch (message.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        break;
        
      case 'typing':
        // Broadcast typing indicator to other participants (if multi-user chat)
        broadcastToSession(ws.tenantId!, ws.sessionToken!, {
          type: 'typing',
          sender: 'user',
          timestamp: new Date().toISOString()
        }, ws);
        break;
        
      case 'stop_typing':
        broadcastToSession(ws.tenantId!, ws.sessionToken!, {
          type: 'stop_typing',
          sender: 'user',
          timestamp: new Date().toISOString()
        }, ws);
        break;
        
      default:
        ws.send(JSON.stringify({ error: 'Unknown message type' }));
    }
  }

  function broadcastToSession(tenantId: string, sessionToken: string, message: any, sender?: WebSocket) {
    const clientKey = `${tenantId}:${sessionToken}`;
    const client = clients.get(clientKey);
    
    if (client && client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  // Utility function to send message to specific session
  function sendToSession(tenantId: string, sessionToken: string, message: any) {
    const clientKey = `${tenantId}:${sessionToken}`;
    const client = clients.get(clientKey);
    
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  return {
    broadcastToSession,
    sendToSession,
    getConnectedClients: () => clients.size
  };
} 