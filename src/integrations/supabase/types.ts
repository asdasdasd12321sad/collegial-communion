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
      chat_requests: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chatroom_members: {
        Row: {
          chatroom_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          chatroom_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          chatroom_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatroom_members_chatroom_id_fkey"
            columns: ["chatroom_id"]
            isOneToOne: false
            referencedRelation: "chatrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatroom_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chatrooms: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_private: boolean | null
          name: string
          owner_id: string
          post_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          owner_id: string
          post_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          owner_id?: string
          post_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatrooms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatrooms_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string | null
          community_type: string
          content: string
          created_at: string
          id: string
          title: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          community_type: string
          content: string
          created_at?: string
          id?: string
          title: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          community_type?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_chats: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_chats_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_chats_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hidden_posts: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hidden_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hidden_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chatroom_id: string | null
          content: string
          created_at: string
          direct_chat_id: string | null
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          chatroom_id?: string | null
          content: string
          created_at?: string
          direct_chat_id?: string | null
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          chatroom_id?: string | null
          content?: string
          created_at?: string
          direct_chat_id?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chatroom_id_fkey"
            columns: ["chatroom_id"]
            isOneToOne: false
            referencedRelation: "chatrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_direct_chat_id_fkey"
            columns: ["direct_chat_id"]
            isOneToOne: false
            referencedRelation: "direct_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          chatroom_id: string | null
          content: string
          created_at: string
          id: string
          post_type: string
          title: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          chatroom_id?: string | null
          content: string
          created_at?: string
          id?: string
          post_type: string
          title: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          chatroom_id?: string | null
          content?: string
          created_at?: string
          id?: string
          post_type?: string
          title?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_provider: string | null
          bio: string | null
          block_status: boolean | null
          created_at: string
          display_name: string
          full_name: string | null
          id: string
          images: Json | null
          is_deleted: boolean | null
          last_login: string | null
          login_email: string | null
          profile_picture_url: string | null
          university: string | null
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          auth_provider?: string | null
          bio?: string | null
          block_status?: boolean | null
          created_at?: string
          display_name: string
          full_name?: string | null
          id: string
          images?: Json | null
          is_deleted?: boolean | null
          last_login?: string | null
          login_email?: string | null
          profile_picture_url?: string | null
          university?: string | null
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          auth_provider?: string | null
          bio?: string | null
          block_status?: boolean | null
          created_at?: string
          display_name?: string
          full_name?: string | null
          id?: string
          images?: Json | null
          is_deleted?: boolean | null
          last_login?: string | null
          login_email?: string | null
          profile_picture_url?: string | null
          university?: string | null
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      reaction_counts: {
        Row: {
          angry_count: number | null
          heart_count: number | null
          id: string
          laugh_count: number | null
          like_count: number | null
          post_id: string | null
          sad_count: number | null
          updated_at: string | null
          wow_count: number | null
        }
        Insert: {
          angry_count?: number | null
          heart_count?: number | null
          id?: string
          laugh_count?: number | null
          like_count?: number | null
          post_id?: string | null
          sad_count?: number | null
          updated_at?: string | null
          wow_count?: number | null
        }
        Update: {
          angry_count?: number | null
          heart_count?: number | null
          id?: string
          laugh_count?: number | null
          like_count?: number | null
          post_id?: string | null
          sad_count?: number | null
          updated_at?: string | null
          wow_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reaction_counts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reported_posts: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reason: string
          reporter_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reason: string
          reporter_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reported_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reported_posts_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_posts: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment: {
        Args: {
          row_id: string
          inc: number
        }
        Returns: undefined
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
