export type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

export type StudentDirectoryRow = {
  id: string
  display_name: string
  email: string | null
  created_at: string
  status: 'active' | 'blocked' | 'unconfirmed'
  lessons_completed: number
}

export interface Database {
  public: {
    Tables: Record<never, never>
    Views: Record<never, never>
    Functions: {
      is_toeic_admin: { Args: Record<never, never>; Returns: boolean }
      list_toeic_students: { Args: { p_limit: number; p_offset: number }; Returns: StudentDirectoryRow[] }
      load_learning: { Args: { p_user_id: string; p_pending_ids: string[] }; Returns: Json }
      commit_learning: {
        Args: { p_user_id: string; p_revision: number; p_operation_ids: string[]; p_state: Json; p_rows: Json }
        Returns: number | null
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
