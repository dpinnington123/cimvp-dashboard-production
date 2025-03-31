export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      check_categories: {
        Row: {
          category_id: number
          category_name: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: number
          category_name: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: number
          category_name?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      checks: {
        Row: {
          bad_score: string
          category_id: number | null
          check_id: number
          check_name: string
          created_at: string | null
          good_score: string
          how_to_analyze: string
          scoring_scale: string | null
          sub_group: string | null
          updated_at: string | null
          what_it_measures: string
        }
        Insert: {
          bad_score: string
          category_id?: number | null
          check_id?: number
          check_name: string
          created_at?: string | null
          good_score: string
          how_to_analyze: string
          scoring_scale?: string | null
          sub_group?: string | null
          updated_at?: string | null
          what_it_measures: string
        }
        Update: {
          bad_score?: string
          category_id?: number | null
          check_id?: number
          check_name?: string
          created_at?: string | null
          good_score?: string
          how_to_analyze?: string
          scoring_scale?: string | null
          sub_group?: string | null
          updated_at?: string | null
          what_it_measures?: string
        }
        Relationships: [
          {
            foreignKeyName: "checks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "check_categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      content: {
        Row: {
          audience_type: string | null
          body: string | null
          client_id: string | null
          content_storage_id: string | null
          created_at: string | null
          format_type: string | null
          id: number
          metadata: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          audience_type?: string | null
          body?: string | null
          client_id?: string | null
          content_storage_id?: string | null
          created_at?: string | null
          format_type?: string | null
          id?: number
          metadata?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          audience_type?: string | null
          body?: string | null
          client_id?: string | null
          content_storage_id?: string | null
          created_at?: string | null
          format_type?: string | null
          id?: number
          metadata?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_reviews: {
        Row: {
          confidence: number | null
          content_id: number
          id: number
          notes: string | null
          overall_comments: string | null
          overall_score: number | null
          reviewed_at: string | null
          reviewer_stage: string | null
          updated_at: string | null
        }
        Insert: {
          confidence?: number | null
          content_id: number
          id?: number
          notes?: string | null
          overall_comments?: string | null
          overall_score?: number | null
          reviewed_at?: string | null
          reviewer_stage?: string | null
          updated_at?: string | null
        }
        Update: {
          confidence?: number | null
          content_id?: number
          id?: number
          notes?: string | null
          overall_comments?: string | null
          overall_score?: number | null
          reviewed_at?: string | null
          reviewer_stage?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      format_checks: {
        Row: {
          check_id: number
          created_at: string
          format_check_id: number
          format_id: number
          priority_level: string | null
          updated_at: string
        }
        Insert: {
          check_id: number
          created_at?: string
          format_check_id?: number
          format_id: number
          priority_level?: string | null
          updated_at?: string
        }
        Update: {
          check_id?: number
          created_at?: string
          format_check_id?: number
          format_id?: number
          priority_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_format_checks_format"
            columns: ["format_id"]
            isOneToOne: false
            referencedRelation: "formats"
            referencedColumns: ["format_id"]
          },
        ]
      }
      formats: {
        Row: {
          audience_type: string | null
          best_use_cases: string | null
          category: string | null
          content_types: string | null
          cost_content_creation: string | null
          cost_distribution: string | null
          created_at: string
          engagement_metric: string | null
          format_id: number
          format_name: string
          notes: string | null
          restrictions: string | null
          typical_usage: string | null
          updated_at: string
        }
        Insert: {
          audience_type?: string | null
          best_use_cases?: string | null
          category?: string | null
          content_types?: string | null
          cost_content_creation?: string | null
          cost_distribution?: string | null
          created_at?: string
          engagement_metric?: string | null
          format_id?: number
          format_name: string
          notes?: string | null
          restrictions?: string | null
          typical_usage?: string | null
          updated_at?: string
        }
        Update: {
          audience_type?: string | null
          best_use_cases?: string | null
          category?: string | null
          content_types?: string | null
          cost_content_creation?: string | null
          cost_distribution?: string | null
          created_at?: string
          engagement_metric?: string | null
          format_id?: number
          format_name?: string
          notes?: string | null
          restrictions?: string | null
          typical_usage?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      "Research Topics": {
        Row: {
          "High Level Topic": string | null
        }
        Insert: {
          "High Level Topic"?: string | null
        }
        Update: {
          "High Level Topic"?: string | null
        }
        Relationships: []
      }
      scores: {
        Row: {
          check_id: number
          check_name: string | null
          client_id: string | null
          comments: string | null
          confidence: number | null
          content_id: number
          created_at: string | null
          fix_recommendation: string | null
          id: number
          score_value: number | null
          updated_at: string | null
        }
        Insert: {
          check_id: number
          check_name?: string | null
          client_id?: string | null
          comments?: string | null
          confidence?: number | null
          content_id: number
          created_at?: string | null
          fix_recommendation?: string | null
          id?: number
          score_value?: number | null
          updated_at?: string | null
        }
        Update: {
          check_id?: number
          check_name?: string | null
          client_id?: string | null
          comments?: string | null
          confidence?: number | null
          content_id?: number
          created_at?: string | null
          fix_recommendation?: string | null
          id?: number
          score_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scores_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      subtopic_checks: {
        Row: {
          check_id: number
          created_at: string
          subtopic_check_id: number
          subtopic_id: number
          updated_at: string
        }
        Insert: {
          check_id: number
          created_at?: string
          subtopic_check_id?: number
          subtopic_id: number
          updated_at?: string
        }
        Update: {
          check_id?: number
          created_at?: string
          subtopic_check_id?: number
          subtopic_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_subtopic_checks_subtopic"
            columns: ["subtopic_id"]
            isOneToOne: false
            referencedRelation: "subtopics"
            referencedColumns: ["subtopic_id"]
          },
        ]
      }
      subtopics: {
        Row: {
          created_at: string
          fix_recommendation: string | null
          subtopic_description: string | null
          subtopic_id: number
          subtopic_name: string
          subtopic_slug: string | null
          tags: string | null
          topic_id: number
          updated_at: string | null
          what_bad_looks_like: string | null
          what_good_looks_like: string | null
          why_important: string | null
        }
        Insert: {
          created_at?: string
          fix_recommendation?: string | null
          subtopic_description?: string | null
          subtopic_id?: number
          subtopic_name: string
          subtopic_slug?: string | null
          tags?: string | null
          topic_id: number
          updated_at?: string | null
          what_bad_looks_like?: string | null
          what_good_looks_like?: string | null
          why_important?: string | null
        }
        Update: {
          created_at?: string
          fix_recommendation?: string | null
          subtopic_description?: string | null
          subtopic_id?: number
          subtopic_name?: string
          subtopic_slug?: string | null
          tags?: string | null
          topic_id?: number
          updated_at?: string | null
          what_bad_looks_like?: string | null
          what_good_looks_like?: string | null
          why_important?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_subtopics_topic"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string | null
          research_status: string | null
          researched: boolean | null
          topic_id: number
          topic_name: string
          topic_summary: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          research_status?: string | null
          researched?: boolean | null
          topic_id?: number
          topic_name: string
          topic_summary?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          research_status?: string | null
          researched?: boolean | null
          topic_id?: number
          topic_name?: string
          topic_summary?: string | null
          updated_at?: string
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
