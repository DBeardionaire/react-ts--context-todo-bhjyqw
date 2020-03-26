import React from "react";
import { TodoModel } from "./models/todo";

type TodoItemProps = {
  todo: TodoModel;
};

export const TodoItem = ({ todo }: TodoItemProps) => {
  const editing = false;
  return (
    <li
      // onClick={handleViewClick}
      className={`${editing ? "editing" : ""} ${todo.done ? "completed" : ""}`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={false}
          onChange={console.log}
          autoFocus={true}
        />
        <label>{todo.title}</label>
        <button className="destroy" onClick={console.log} />
      </div>
    </li>
  );
};

// {editing && (
//   <input
//     ref={ref}
//     className="edit"
//     value={todo.label}
//     onChange={onChange}
//     onKeyPress={onEnter}
//   />
// )}
