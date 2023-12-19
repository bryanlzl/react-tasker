import React, { useState } from "react";
import "../styles/taskTracker/task.css";

function TaskCreateForm(props) {
  // formType == 'create' or 'edit'
  const formType = props.formType;
  const taskEditHandler = props.taskEditHandler;
  const taskId = formType === "edit" ? props.taskId : -1;
  const closeEdit = formType === "edit" ? props.isOpen : -1;

  console.log(props.taskId);

  const [taskForm, setTaskForm] = useState({
    taskName: "",
    priority: "",
    dueDate: new Date(),
  });
  const handleInputChange = (event) => {
    let { name, value } = event.target;
    value = name === "dueDate" ? new Date(value) : value;
    setTaskForm((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    taskEditHandler(formType, taskId, taskForm);
  };

  return (
    <div>
      <form
        className={formType === "edit" ? "task-edit-form" : "task-create-form"}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="taskName"
          placeholder="Rename Task"
          onChange={handleInputChange}
        />
        <select
          name="taskPriority"
          onChange={handleInputChange}
          defaultValue="Low"
        >
          <option>Change Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          name="dueDate"
          onChange={handleInputChange}
          defaultValue={new Date()}
        />
        <button
          onClick={(event) => {
            handleSubmit(event);
            formType === "edit" && closeEdit(false);
          }}
        >
          {formType === "edit" ? "Set Changes" : "Create Task"}
        </button>
        {formType === "edit" && (
          <button
            onClick={() => {
              closeEdit((prev) => {
                return !prev;
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default TaskCreateForm;