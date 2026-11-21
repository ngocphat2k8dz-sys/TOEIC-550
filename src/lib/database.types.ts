export type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

export interface Database {
  public: {
    Tables: Record<never, never>
    Views: Record<never, never>
    Functions: {
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
