export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      bets: {
        Row: {
          actual_payout: number | null
          bet_amount: number
          bet_type: string
          event_id: string | null
          game_session_id: string | null
          id: string
          odds: number | null
          placed_at: string | null
          potential_payout: number | null
          settled_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          actual_payout?: number | null
          bet_amount: number
          bet_type: string
          event_id?: string | null
          game_session_id?: string | null
          id?: string
          odds?: number | null
          placed_at?: string | null
          potential_payout?: number | null
          settled_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          actual_payout?: number | null
          bet_amount?: number
          bet_type?: string
          event_id?: string | null
          game_session_id?: string | null
          id?: string
          odds?: number | null
          placed_at?: string | null
          potential_payout?: number | null
          settled_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sports_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          is_global: boolean | null
          message: string
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_global?: boolean | null
          message: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_global?: boolean | null
          message?: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          bet_amount: number
          client_seed: string | null
          created_at: string | null
          game_id: string
          id: string
          nonce: number | null
          payout: number | null
          result: Json | null
          server_seed: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          bet_amount: number
          client_seed?: string | null
          created_at?: string | null
          game_id: string
          id?: string
          nonce?: number | null
          payout?: number | null
          result?: Json | null
          server_seed?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          bet_amount?: number
          client_seed?: string | null
          created_at?: string | null
          game_id?: string
          id?: string
          nonce?: number | null
          payout?: number | null
          result?: Json | null
          server_seed?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          config: Json | null
          created_at: string | null
          description: string | null
          house_edge: number | null
          id: string
          is_active: boolean | null
          max_bet: number | null
          min_bet: number | null
          name: string
          type: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          house_edge?: number | null
          id?: string
          is_active?: boolean | null
          max_bet?: number | null
          min_bet?: number | null
          name: string
          type: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          house_edge?: number | null
          id?: string
          is_active?: boolean | null
          max_bet?: number | null
          min_bet?: number | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      international_matches: {
        Row: {
          away_score: number | null
          away_team: string
          competition: string
          created_at: string | null
          home_score: number | null
          home_team: string
          id: string
          live_odds: Json | null
          match_date: string
          odds: Json | null
          status: string | null
        }
        Insert: {
          away_score?: number | null
          away_team: string
          competition: string
          created_at?: string | null
          home_score?: number | null
          home_team: string
          id?: string
          live_odds?: Json | null
          match_date: string
          odds?: Json | null
          status?: string | null
        }
        Update: {
          away_score?: number | null
          away_team?: string
          competition?: string
          created_at?: string | null
          home_score?: number | null
          home_team?: string
          id?: string
          live_odds?: Json | null
          match_date?: string
          odds?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      live_bets: {
        Row: {
          actual_payout: number | null
          bet_type: string
          event_id: string | null
          id: string
          odds: number
          placed_at: string | null
          potential_payout: number
          selection: string
          settled_at: string | null
          stake: number
          status: string | null
          user_id: string
        }
        Insert: {
          actual_payout?: number | null
          bet_type: string
          event_id?: string | null
          id?: string
          odds: number
          placed_at?: string | null
          potential_payout: number
          selection: string
          settled_at?: string | null
          stake: number
          status?: string | null
          user_id: string
        }
        Update: {
          actual_payout?: number | null
          bet_type?: string
          event_id?: string | null
          id?: string
          odds?: number
          placed_at?: string | null
          potential_payout?: number
          selection?: string
          settled_at?: string | null
          stake?: number
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_bets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sports_events"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          kyc_documents: Json | null
          kyc_status: string | null
          last_name: string | null
          phone: string | null
          referral_code: string | null
          total_wagered: number | null
          two_fa_enabled: boolean | null
          updated_at: string | null
          user_id: string
          username: string | null
          vip_level_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          last_name?: string | null
          phone?: string | null
          referral_code?: string | null
          total_wagered?: number | null
          two_fa_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          vip_level_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          last_name?: string | null
          phone?: string | null
          referral_code?: string | null
          total_wagered?: number | null
          two_fa_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          vip_level_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_vip_level_id_fkey"
            columns: ["vip_level_id"]
            isOneToOne: false
            referencedRelation: "vip_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          code: string
          commission_earned: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          referred_id: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          code: string
          commission_earned?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          code?: string
          commission_earned?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      sports_events: {
        Row: {
          away_score: number | null
          away_team: string
          created_at: string | null
          event_date: string
          home_score: number | null
          home_team: string
          id: string
          league: string | null
          odds: Json | null
          sport_type: string | null
          status: string | null
        }
        Insert: {
          away_score?: number | null
          away_team: string
          created_at?: string | null
          event_date: string
          home_score?: number | null
          home_team: string
          id?: string
          league?: string | null
          odds?: Json | null
          sport_type?: string | null
          status?: string | null
        }
        Update: {
          away_score?: number | null
          away_team?: string
          created_at?: string | null
          event_date?: string
          home_score?: number | null
          home_team?: string
          id?: string
          league?: string | null
          odds?: Json | null
          sport_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          external_transaction_id: string | null
          id: string
          payment_method: string | null
          phone_number: string | null
          provider_response: Json | null
          reference_number: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          external_transaction_id?: string | null
          id?: string
          payment_method?: string | null
          phone_number?: string | null
          provider_response?: Json | null
          reference_number?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          external_transaction_id?: string | null
          id?: string
          payment_method?: string | null
          phone_number?: string | null
          provider_response?: Json | null
          reference_number?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          deposit_limit: number | null
          id: string
          language: string | null
          loss_limit: number | null
          notification_preferences: Json | null
          self_exclusion_until: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deposit_limit?: number | null
          id?: string
          language?: string | null
          loss_limit?: number | null
          notification_preferences?: Json | null
          self_exclusion_until?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deposit_limit?: number | null
          id?: string
          language?: string | null
          loss_limit?: number | null
          notification_preferences?: Json | null
          self_exclusion_until?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      vip_levels: {
        Row: {
          benefits: Json
          created_at: string | null
          id: string
          level: number
          name: string
          requirements: Json
        }
        Insert: {
          benefits: Json
          created_at?: string | null
          id?: string
          level: number
          name: string
          requirements: Json
        }
        Update: {
          benefits?: Json
          created_at?: string | null
          id?: string
          level?: number
          name?: string
          requirements?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_balance: {
        Args: { user_uuid: string; amount: number; transaction_type: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
