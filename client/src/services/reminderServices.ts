import { InsertReminder } from "@/types/reminderTypes";

export async function getReminders() {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reminders`);
  if (!response.ok) {
    throw new Error("Failed to fetch Reminders");
  }
  return response.json();
}
export async function completeReminders(id: number, isCompleted: boolean) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/reminders/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !isCompleted }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update Reminders");
  }
  return response.json();
}
export async function createReminders(
  reminder: string,
  note: string,
  user_id = 1
) {
  let payloadData: InsertReminder = { reminder, user_id };

  if (note) {
    payloadData.note = note;
  }
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadData),
  });
  if (!response.ok) {
    throw new Error("Failed to update Reminders");
  }
  return response.json();
}
export async function deleteReminders(id: any) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/reminders/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update Reminders");
  }
  return response.json();
}

export async function updateReminders(id: Number, formData: InsertReminder) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/reminders/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update Reminders");
  }
  return response.json();
}
