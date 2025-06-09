import db from "../config/db.js";

export async function up() {
  try {
    db.query(`CREATE TABLE IF NOT EXISTS reminders(
        id SERIAL PRIMARY KEY,
        reminder VARCHAR(100) NOT NULL,
        note TEXT,
        completed BOOLEAN DEFAULT FALSE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
  } catch (error) {
    console.log(error);
  }
}

export async function down() {
  try {
    db.query(`DROP TABLE IF EXISTS reminders`);
  } catch (error) {
    console.log(error);
  }
}
up();
