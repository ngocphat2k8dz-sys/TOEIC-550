import type { Json } from '../lib/database.types'
import { supabase } from '../lib/supabase'
import { learningRows, normalizeLearning, type LearningState, type VersionedLearning } from './learningState'

export async function loadLearning(userId: string, operationIds: string[], signal: AbortSignal) {
  if (!supabase) throw new Error('Cloud unavailable')
  const { error, data } = await supabase.rpc('load_learning', {
    p_user_id: userId, p_pending_ids: operationIds,
  }).abortSignal(signal)
  if (error || !data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Load failed')
  const { revision, state, display_name, target_score, daily_goal, acknowledged } = data
  if (typeof revision !== 'number' || !Array.isArray(acknowledged)) throw new Error('Invalid cloud response')
  const account = normalizeLearning(state as Partial<LearningState> | undefined)
  account.displayName = typeof display_name === 'string' ? display_name : ''
  if (typeof target_score === 'number') account.progress.settings = { ...account.progress.settings, target: target_score }
  if (typeof daily_goal === 'number') account.progress.settings = { ...account.progress.settings, dailyGoal: daily_goal }
  return { snapshot: { revision, state: account }, acknowledged: acknowledged.filter(id => typeof id === 'string') }
}

export async function commitLearning(userId: string, latest: VersionedLearning, operationIds: string[], signal: AbortSignal) {
  if (!supabase) throw new Error('Cloud unavailable')
  const { data, error } = await supabase.rpc('commit_learning', {
    p_user_id: userId, p_revision: latest.revision, p_operation_ids: operationIds,
    p_state: JSON.parse(JSON.stringify(latest.state)) as Json,
    p_rows: learningRows(latest.state.progress),
  }).abortSignal(signal)
  if (error) throw new Error('Commit failed')
  return data
}
