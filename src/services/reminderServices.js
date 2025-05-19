import ERROR_MESSAGES from "../constants/errorMessages.js";
import { ReminderModels } from "../models/reminderModels.js";
import CustomError from "../utils/CustomErrors.js";

export const reminderServices = {
  async getAllReminders() {
    // Fetch all reminders
    return ReminderModels.getAll();
  },
  async getRemindersById(id) {
    // get  all reminders by Id
    const reminder = await ReminderModels.findById(id);
    if (!reminder) {
      throw new CustomError(ERROR_MESSAGES.REMINDER_NOT_FOUND, 404);
    }
    return reminder;
  },
  async createReminders(newReminder) {
    const { reminder, note, user_id } = newReminder;
    const sanitizeReminder = {
      reminder: reminder?.trim(),
      note: note?.trim(),
      user_id,
    }; // Create  reminders
    const createReminder = ReminderModels.create(sanitizeReminder);
    return createReminder;
  },
  async updateReminders(reminderId, newValues) {
    const updatedReminder = await ReminderModels.update(reminderId, newValues);
    if (!updatedReminder) {
      throw new CustomError(ERROR_MESSAGES.REMINDER_NOT_FOUND);
    }
    return updatedReminder;
  },
  async deleteReminder(reminderId) {
    const authUserId = 1; // In real code, this should come from your auth middleware/session

    // Step 1: Check if reminder exists
    const reminder = await ReminderModels.findById(reminderId);

    if (!reminder) {
      throw new CustomError(ERROR_MESSAGES.REMINDER_NOT_FOUND, 404);
    }

    // Step 2: Optional - Check ownership (if your reminder table has user_id)
    if (reminder.user_id !== authUserId) {
      throw new CustomError(ERROR_MESSAGES.FORBIDDEN, 403);
    }

    const deletedCount = await ReminderModels.delete(reminderId);

    if (deletedCount === 0) {
      throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }

    return { message: "Reminder Deleted Successfully" };
  },
};
