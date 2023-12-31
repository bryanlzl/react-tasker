import React, { useState, useEffect } from "react";
import TaskList from "./taskList";
import axios from "axios";
import "../../styles/taskTracker/taskTracker.css";

function TaskTracker() {
  const [tasks, setTasks] = useState({});
  const [saveMessage, setSaveMessage] = useState({
    visible: false,
    message: "Task List Saved!",
  });
  const saveMessageHandler = (saveType) => {
    setSaveMessage((prev) => {
      return {
        visible: true,
        message: `${
          saveType === "save" ? "Task List Saved!" : "Changes Discarded"
        }`,
      };
    });
    const timeOut = setTimeout(() => {
      setSaveMessage((prev) => {
        return { ...prev, visible: false };
      });
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  };

  const saveChangeHandler = () => {
    axios
      .post("http://localhost:5000/api/tasks/update", tasks)
      .then((res) => {})
      .catch((error) => console.log(error));
  };
  const fetchDBTasks = () => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => {
        const taskList = {};
        Object.entries(res.data).forEach(([key, value]) => {
          taskList[key] = {
            taskName: value.task_name,
            taskPriority: value.task_priority,
            dueDate: new Date(value.due_date),
            isCompleted: value.is_completed,
          };
        });
        setTasks({ ...taskList });
      })
      .catch((error) => console.log(error));
  };
  const taskChangeHandler = (action, idx, changes) => {
    // CHANGE == changes is a dict of changed values for idx
    // CREATE == changes is a dict of the new task
    if (action === "delete") {
      setTasks((prev) => {
        const filteredTasks = Object.entries(prev)
          .filter((key) => parseInt(key) !== idx)
          .map(([, value]) => value);
        const newTasks = {};
        filteredTasks.forEach((task, index) => {
          newTasks[index] = task;
        });
        return newTasks;
      });
    } else if (action === "create") {
      setTasks((prev) => {
        const keysList = Object.keys(prev);
        const newIdx = keysList.length ? Number(Math.max(...keysList)) + 1 : 0;
        return { ...prev, [newIdx]: { ...changes } };
      });
    } else if (action === "edit") {
      setTasks((prev) => {
        return { ...prev, [idx]: { ...changes } };
      });
    } else if (action === "complete") {
      setTasks((prev) => {
        return {
          ...prev,
          [idx]: { ...prev[idx], isCompleted: !prev[idx].isCompleted },
        };
      });
    }
  };

  useEffect(() => {
    fetchDBTasks();
  }, []);

  useEffect(() => {}, []);

  return (
    <div className="task-tracker">
      <div className="task-tracker-content">
        <h1 className="task-title">To-Do List:</h1>
        <TaskList
          taskList={tasks}
          taskChangeHandler={taskChangeHandler}
        ></TaskList>
        <div className="task-save-change-bar">
          <div className="task-save-change">
            <button
              className="save-change-button"
              onClick={() => {
                saveChangeHandler();
                saveMessageHandler("save");
              }}
            >
              Save Change
            </button>
            <button
              className="discard-change-button"
              onClick={() => {
                fetchDBTasks();
                saveMessageHandler("cancel");
              }}
            >
              Discard Change
            </button>
          </div>
          {saveMessage.visible && (
            <p className="save-status-message">{saveMessage.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskTracker;
