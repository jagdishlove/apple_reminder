import db from "../config/db.js";

export const ReminderModels = {
  async getAll() {
    const result = await db.query(
      `SELECT * FROM reminders ORDER BY created_at DESC`
    );
    return result.rows;
  },
  async findById(id) {
    const result = await db.query(`SELECT * FROM reminders WHERE id = $1`, [
      id,
    ]);
    return result.rows[0];
  },
  async create(data) {
    const { reminder, note, user_id } = data;
    const result = await db.query(
      `INSERT INTO reminders (reminder,note,user_id) VALUES($1,$2,$3) RETURNING *`,
      [reminder, note, user_id]
    );

    return result?.rows[0];
  },

  async update(id, data) {
    const keys = Object.keys(data);

    if (keys.length === 0) {
      throw new Error("No fields provided to update");
    }

    // Build SET clause dynamically
    const setClause = keys
      .map((key, index) => `"${key}" = $${index + 2}`)
      .join(", ");

    const values = Object.values(data);

    const query = `UPDATE reminders SET ${setClause} WHERE id = $1 RETURNING *`;

    const result = await db.query(query, [id, ...values]);

    return result.rows[0]; // Return updated row
  },
  async delete(id) {
    const result = await db.query(`DELETE FROM reminders WHERE id=$1`, [id]);
    return result.rowCount;
  },
};
