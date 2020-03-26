import React from "react";
import { TodoModel } from './models/todo'

export const TodoItem = (todo: TodoModel) => {
  const editing = false
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
        <label>{todo.label}</label>
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