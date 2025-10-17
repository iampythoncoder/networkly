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
          email: string
          full_name: string | null
          school: string | null
          grade_level: string | null
          bio: string | null
          interests: string[]
          achievements: string[]
          projects: string[]
          skills: string[]
          resume_url: string | null
          profile_image_url: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          school?: string | null
          grade_level?: string | null
          bio?: string | null
          interests?: string[]
          achievements?: string[]
          projects?: string[]
          skills?: string[]
          resume_url?: string | null
          profile_image_url?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          school?: string | null
          grade_level?: string | null
          bio?: string | null
          interests?: string[]
          achievements?: string[]
          projects?: string[]
          skills?: string[]
          resume_url?: string | null
          profile_image_url?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          title: string
          type: 'internship' | 'scholarship' | 'summer_program' | 'research' | 'competition'
          description: string
          organization: string
          location: string | null
          deadline: string | null
          grade_levels: string[]
          interests: string[]
          application_url: string | null
          is_featured: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'internship' | 'scholarship' | 'summer_program' | 'research' | 'competition'
          description: string
          organization: string
          location?: string | null
          deadline?: string | null
          grade_levels?: string[]
          interests?: string[]
          application_url?: string | null
          is_featured?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'internship' | 'scholarship' | 'summer_program' | 'research' | 'competition'
          description?: string
          organization?: string
          location?: string | null
          deadline?: string | null
          grade_levels?: string[]
          interests?: string[]
          application_url?: string | null
          is_featured?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          opportunity_id: string
          status: 'saved' | 'applied' | 'accepted' | 'rejected'
          notes: string | null
          applied_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          opportunity_id: string
          status?: 'saved' | 'applied' | 'accepted' | 'rejected'
          notes?: string | null
          applied_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          opportunity_id?: string
          status?: 'saved' | 'applied' | 'accepted' | 'rejected'
          notes?: string | null
          applied_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'deadline' | 'new_opportunity' | 'profile_reminder'
          title: string
          message: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'deadline' | 'new_opportunity' | 'profile_reminder'
          title: string
          message: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'deadline' | 'new_opportunity' | 'profile_reminder'
          title?: string
          message?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}
