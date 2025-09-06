export interface Dream {
  user_id: string;
  idx: number;
  id: string;
  created_at: string;
  message_id: string;
  image: string;
  dream_summary: string | null;
  dream_category: string | null;
  return_message_id: string | null;
  prompt: string;
}
