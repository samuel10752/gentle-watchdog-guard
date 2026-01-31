export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          pc_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          pc_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          pc_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_pc_id_fkey"
            columns: ["pc_id"]
            isOneToOne: false
            referencedRelation: "managed_pcs"
            referencedColumns: ["id"]
          },
        ]
      }
      managed_pcs: {
        Row: {
          cpu_info: string | null
          created_at: string
          hostname: string | null
          id: string
          ip_address: string | null
          last_boot_time: string | null
          last_seen: string | null
          machine_id: string
          os_version: string | null
          ram_info: string | null
          status: Database["public"]["Enums"]["pc_status"] | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          updated_at: string
        }
        Insert: {
          cpu_info?: string | null
          created_at?: string
          hostname?: string | null
          id?: string
          ip_address?: string | null
          last_boot_time?: string | null
          last_seen?: string | null
          machine_id: string
          os_version?: string | null
          ram_info?: string | null
          status?: Database["public"]["Enums"]["pc_status"] | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string
        }
        Update: {
          cpu_info?: string | null
          created_at?: string
          hostname?: string | null
          id?: string
          ip_address?: string | null
          last_boot_time?: string | null
          last_seen?: string | null
          machine_id?: string
          os_version?: string | null
          ram_info?: string | null
          status?: Database["public"]["Enums"]["pc_status"] | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pc_commands: {
        Row: {
          command: string
          command_type: string
          created_at: string
          error_message: string | null
          executed_at: string | null
          id: string
          pc_id: string
          result: string | null
          status: Database["public"]["Enums"]["command_status"] | null
        }
        Insert: {
          command: string
          command_type?: string
          created_at?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          pc_id: string
          result?: string | null
          status?: Database["public"]["Enums"]["command_status"] | null
        }
        Update: {
          command?: string
          command_type?: string
          created_at?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          pc_id?: string
          result?: string | null
          status?: Database["public"]["Enums"]["command_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "pc_commands_pc_id_fkey"
            columns: ["pc_id"]
            isOneToOne: false
            referencedRelation: "managed_pcs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      terms_acceptance_log: {
        Row: {
          accepted_at: string
          id: string
          ip_address: string | null
          pc_id: string
          terms_id: string
          user_name: string | null
        }
        Insert: {
          accepted_at?: string
          id?: string
          ip_address?: string | null
          pc_id: string
          terms_id: string
          user_name?: string | null
        }
        Update: {
          accepted_at?: string
          id?: string
          ip_address?: string | null
          pc_id?: string
          terms_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "terms_acceptance_log_pc_id_fkey"
            columns: ["pc_id"]
            isOneToOne: false
            referencedRelation: "managed_pcs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_acceptance_log_terms_id_fkey"
            columns: ["terms_id"]
            isOneToOne: false
            referencedRelation: "terms_of_use"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_of_use: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          title: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          title?: string
          version?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "viewer"
      command_status: "pending" | "sent" | "executed" | "failed"
      pc_status: "online" | "offline" | "pending_terms"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "viewer"],
      command_status: ["pending", "sent", "executed", "failed"],
      pc_status: ["online", "offline", "pending_terms"],
    },
  },
} as const
