const express = require("express");
const router = express.Router();
const pool = require("../db/db");

router.get("/", async (req, res) => {
  try {
    const rawTaskTable = await pool.query(`SELECT * FROM tasks`);
    res.json(rawTaskTable.rows);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.post("/update", async (req, res) => {
  try {
    const rawSQLTable = req.body;
    const taskSQLTable = Object.entries(rawSQLTable).map(([key, value]) => ({
      task_idx: key,
      task_name: value.taskName,
      task_priority: value.taskPriority,
      due_date: value.dueDate,
      is_completed: value.isCompleted,
    }));

    await pool.query("BEGIN");
    await pool.query("TRUNCATE TABLE tasks RESTART IDENTITY");
    for (const task of taskSQLTable) {
      await pool.query(
        "INSERT INTO tasks (task_name, task_priority, due_date, is_completed) VALUES ($1, $2, $3, $4)",
        [task.task_name, task.task_priority, task.due_date, task.is_completed]
      );
    }
    await pool.query("COMMIT");
    res.json({ message: "Task table updated successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.json(err);
  }
});

module.exports = router;

/*const taskList = {
  0: {
    taskName: "Make bed",
    taskPriority: "Low",
    dueDate: new Date(tempDueDate.getTime() + 1231286400000),
    isCompleted: false,
  },
  1: {
    taskName: "Breakfast",
    taskPriority: "High",
    dueDate: new Date(tempDueDate.getTime() + 12382122460),
    isCompleted: false,
  },
  2: {
    taskName: "Popcorn",
    taskPriority: "Medium",
    dueDate: new Date(tempDueDate.getTime() + 8645500),
    isCompleted: false,
  },
  3: {
    taskName: "Watch movie",
    taskPriority: "Low",
    dueDate: new Date(tempDueDate.getTime() + 81201233123),
    isCompleted: false,
  },
};*/

/*
{
      task_idx: key,
      task_name: value.taskName,
      task_priority: value.taskPriority,
      due_date: value.dueDate.toISOtring(),
      is_completed: value.isCompleted,
    }
*/
