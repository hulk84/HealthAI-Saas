export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          age: number | null
          gender: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          age?: number | null
          gender?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          age?: number | null
          gender?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trainer_assessments: {
        Row: {
          id: string
          user_id: string
          fitness_level: string
          injuries: Json | null
          goals: Json
          equipment: Json
          availability: Json
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fitness_level: string
          injuries?: Json | null
          goals: Json
          equipment: Json
          availability: Json
          preferences: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fitness_level?: string
          injuries?: Json | null
          goals?: Json
          equipment?: Json
          availability?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      nutritionist_assessments: {
        Row: {
          id: string
          user_id: string
          weight: number
          height: number
          activity_level: string
          allergies: Json | null
          dietary_restrictions: Json | null
          caloric_needs: number | null
          macro_distribution: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight: number
          height: number
          activity_level: string
          allergies?: Json | null
          dietary_restrictions?: Json | null
          caloric_needs?: number | null
          macro_distribution?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number
          height?: number
          activity_level?: string
          allergies?: Json | null
          dietary_restrictions?: Json | null
          caloric_needs?: number | null
          macro_distribution?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      chef_preferences: {
        Row: {
          id: string
          user_id: string
          cooking_level: string
          time_available: string
          cooking_methods: Json
          kitchen_tools: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cooking_level: string
          time_available: string
          cooking_methods: Json
          kitchen_tools: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cooking_level?: string
          time_available?: string
          cooking_methods?: Json
          kitchen_tools?: Json
          created_at?: string
          updated_at?: string
        }
      }
      psychologist_assessments: {
        Row: {
          id: string
          user_id: string
          stress_level: number
          motivations: Json
          barriers: Json
          learning_style: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stress_level: number
          motivations: Json
          barriers: Json
          learning_style: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stress_level?: number
          motivations?: Json
          barriers?: Json
          learning_style?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          agent_type: 'trainer' | 'nutritionist' | 'chef' | 'psychologist'
          message: string
          response: string
          model_used: string | null
          tokens_used: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_type: 'trainer' | 'nutritionist' | 'chef' | 'psychologist'
          message: string
          response: string
          model_used?: string | null
          tokens_used?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_type?: 'trainer' | 'nutritionist' | 'chef' | 'psychologist'
          message?: string
          response?: string
          model_used?: string | null
          tokens_used?: number | null
          created_at?: string
        }
      }
      generated_plans: {
        Row: {
          id: string
          user_id: string
          plan_type: 'workout' | 'meal' | 'recipe' | 'wellness'
          content: Json
          active: boolean
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: 'workout' | 'meal' | 'recipe' | 'wellness'
          content: Json
          active?: boolean
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: 'workout' | 'meal' | 'recipe' | 'wellness'
          content?: Json
          active?: boolean
          created_at?: string
          expires_at?: string | null
        }
      }
    }
  }
}