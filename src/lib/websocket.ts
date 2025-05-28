import { io, Socket } from 'socket.io-client';
import { supabase } from '@/integrations/supabase/client';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  async connect() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      this.socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
        auth: {
          token: session.access_token
        }
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      // Handle incoming notifications
      this.socket.on('notification', (data) => {
        this.notifyListeners('notification', data);
      });

      // Handle chat messages
      this.socket.on('chat_message', (data) => {
        this.notifyListeners('chat_message', data);
      });

      // Handle game updates
      this.socket.on('game_update', (data) => {
        this.notifyListeners('game_update', data);
      });
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private notifyListeners(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  // Send chat message
  sendChatMessage(message: string, receiverId?: string) {
    if (!this.socket) return;
    this.socket.emit('chat_message', { message, receiverId });
  }

  // Join chat room
  joinChatRoom(roomId: string) {
    if (!this.socket) return;
    this.socket.emit('join_room', roomId);
  }

  // Leave chat room
  leaveChatRoom(roomId: string) {
    if (!this.socket) return;
    this.socket.emit('leave_room', roomId);
  }
}

export const websocketService = new WebSocketService();