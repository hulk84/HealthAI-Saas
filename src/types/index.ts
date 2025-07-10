export interface User {
  id: string
  email: string
  full_name?: string
  created_at: string
}

export interface OnboardingData {
  // Basic Info
  full_name: string
  age: number
  gender: 'male' | 'female' | 'other'
  
  // Trainer Assessment
  fitness_level: 'beginner' | 'intermediate' | 'advanced'
  injuries: string[]
  fitness_goals: string[]
  available_equipment: string[]
  workout_availability: {
    days_per_week: number
    minutes_per_session: number
    preferred_time: 'morning' | 'afternoon' | 'evening'
  }
  exercise_preferences: string[]
  
  // Nutritionist Assessment
  weight: number
  height: number
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active'
  allergies: string[]
  dietary_restrictions: string[]
  nutrition_goals: string[]
  meal_frequency: number
  
  // Chef Preferences
  cooking_level: 'beginner' | 'intermediate' | 'advanced'
  time_available: '15min' | '30min' | '45min' | '60min+'
  cooking_methods: string[]
  kitchen_tools: string[]
  flavor_preferences: string[]
  
  // Psychologist Assessment
  stress_level: number // 1-10
  motivations: string[]
  barriers: string[]
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  support_preferences: string[]
}

export type AgentType = 'trainer' | 'nutritionist' | 'chef' | 'psychologist'

export interface ChatMessage {
  id: string
  user_id: string
  agent_type: AgentType
  message: string
  response: string
  created_at: string
}

export interface Plan {
  id: string
  type: 'workout' | 'meal' | 'recipe' | 'wellness'
  title: string
  content: any
  active: boolean
  created_at: string
  expires_at?: string
}