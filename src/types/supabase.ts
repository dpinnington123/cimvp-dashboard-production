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
      category_review_summaries: {
        Row: {
          id: number
          content_review_id: number
          category_name: string
          category_score: number
          num_checks: number
          check_details: string | null
          summary_comment: string | null
          client_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          content_review_id: number
          category_name: string
          category_score: number
          num_checks: number
          check_details?: string | null
          summary_comment?: string | null
          client_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          content_review_id?: number
          category_name?: string
          category_score?: number
          num_checks?: number
          check_details?: string | null
          summary_comment?: string | null
          client_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_review_summaries_content_review_id_fkey"
            columns: ["content_review_id"]
            isOneToOne: false
            referencedRelation: "content_reviews"
            referencedColumns: ["id"]
          }
        ]
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
          agency: string | null
          audience: string | null
          bucket_id: string | null
          campaign_aligned_to: string | null
          client_id: string | null
          content_name: string
          content_objectives: string | null
          created_at: string | null
          expiry_date: string | null
          file_storage_path: string | null
          format: string | null
          funnel_alignment: string | null
          id: number
          status: string | null
          strategy_aligned_to: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          agency?: string | null
          audience?: string | null
          bucket_id?: string | null
          campaign_aligned_to?: string | null
          client_id?: string | null
          content_name: string
          content_objectives?: string | null
          created_at?: string | null
          expiry_date?: string | null
          file_storage_path?: string | null
          format?: string | null
          funnel_alignment?: string | null
          id?: number
          status?: string | null
          strategy_aligned_to?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          agency?: string | null
          audience?: string | null
          bucket_id?: string | null
          campaign_aligned_to?: string | null
          client_id?: string | null
          content_name?: string
          content_objectives?: string | null
          created_at?: string | null
          expiry_date?: string | null
          file_storage_path?: string | null
          format?: string | null
          funnel_alignment?: string | null
          id?: number
          status?: string | null
          strategy_aligned_to?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_reviews: {
        Row: {
          client_id: string | null
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
          client_id?: string | null
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
          client_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "content_reviews_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
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
          content_review_id: number
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
          content_review_id: number
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
          content_review_id?: number
          created_at?: string | null
          fix_recommendation?: string | null
          id?: number
          score_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scores_content_review_id_fkey"
            columns: ["content_review_id"]
            isOneToOne: false
            referencedRelation: "content_reviews"
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

