export type Reminder = {
  id: number;
  reminder: string | null;
  note: string;
  completed: boolean;
  user_id: number;
  created_at: string;
};

export type InsertReminder = {
  reminder: string;
  note?: string | null;
  user_id: number;
};
export type UpdateReminder = {
  reminder?: string;
  note?: string | null;
};
