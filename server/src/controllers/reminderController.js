import { reminderServices } from "../services/reminderServices.js";

export const ReminderController = {
  async getAllReminders(req, res, next) {
    try {
      const reminder = await reminderServices.getAllReminders();
      res.status(200).json(reminder);
    } catch (error) {
      next(error);
    }
  },
  async getReminderById(req, res, next) {
    try {
      const reminderId = req.params.id;
      const reminder = await reminderServices.getRemindersById(reminderId);
      res.status(200).json(reminder);
    } catch (error) {
      next(error);
    }
  },
  async createReminder(req, res, next) {
    try {
      const reminder = await reminderServices.createReminders(req.body);
      res.status(200).json(reminder);
    } catch (error) {
      next(error);
    }
  },
  async updateReminder(req, res, next) {
    try {
      const reminderId = req.params.id;
      const reminder = await reminderServices.updateReminders(
        reminderId,
        req.body
      );
      res.status(200).json(reminder);
    } catch (error) {
      next(error);
    }
  },
  async deleteReminder(req, res, next) {
    try {
      const reminderId = req.params.id;
      const reminder = await reminderServices.deleteReminder(reminderId);
      res.status(200).json(reminder);
    } catch (error) {
      next(error);
    }
  },
};
