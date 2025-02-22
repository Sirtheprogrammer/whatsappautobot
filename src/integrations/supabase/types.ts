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
      bot_commands: {
        Row: {
          command_data: Json | null
          command_type: string
          created_at: string | null
          id: string
          session_id: string | null
        }
        Insert: {
          command_data?: Json | null
          command_type: string
          created_at?: string | null
          id?: string
          session_id?: string | null
        }
        Update: {
          command_data?: Json | null
          command_type?: string
          created_at?: string | null
          id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_commands_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_configurations: {
        Row: {
          anti_view_once: boolean | null
          auto_recording: boolean | null
          auto_status_view: boolean | null
          auto_typing: boolean | null
          created_at: string | null
          custom_emojis: Json | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          anti_view_once?: boolean | null
          auto_recording?: boolean | null
          auto_status_view?: boolean | null
          auto_typing?: boolean | null
          created_at?: string | null
          custom_emojis?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          anti_view_once?: boolean | null
          auto_recording?: boolean | null
          auto_status_view?: boolean | null
          auto_typing?: boolean | null
          created_at?: string | null
          custom_emojis?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bot_statistics: {
        Row: {
          commands_used: number | null
          id: string
          last_updated: string | null
          messages_received: number | null
          messages_sent: number | null
          session_id: string | null
          uptime_seconds: number | null
        }
        Insert: {
          commands_used?: number | null
          id?: string
          last_updated?: string | null
          messages_received?: number | null
          messages_sent?: number | null
          session_id?: string | null
          uptime_seconds?: number | null
        }
        Update: {
          commands_used?: number | null
          id?: string
          last_updated?: string | null
          messages_received?: number | null
          messages_sent?: number | null
          session_id?: string | null
          uptime_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_statistics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      message_history: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          message_type: string
          metadata: Json | null
          session_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          message_type: string
          metadata?: Json | null
          session_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      whatsapp_sessions: {
        Row: {
          connection_status: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_connected: string | null
          last_ping: string | null
          phone_number: string
          session_data: Json | null
          updated_at: string | null
          user_id: string | null
          websocket_id: string | null
        }
        Insert: {
          connection_status?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_connected?: string | null
          last_ping?: string | null
          phone_number: string
          session_data?: Json | null
          updated_at?: string | null
          user_id?: string | null
          websocket_id?: string | null
        }
        Update: {
          connection_status?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_connected?: string | null
          last_ping?: string | null
          phone_number?: string
          session_data?: Json | null
          updated_at?: string | null
          user_id?: string | null
          websocket_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
