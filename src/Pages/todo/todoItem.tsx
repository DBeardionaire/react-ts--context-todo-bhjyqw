import React, { useCallback, useState, useRef } from "react"
import useOnClickOutside from 'use-onclickoutside'
import { TodoModel } from "./models/todo"
import { useTodos } from "./state/todoContext"
import { useOnEnter, useDoubleClick } from "../../helpers/helpers"

type TodoItemProps = {
  todo: TodoModel
}

const { setTodo, toggleTodo, deleteTodo } = useTodos.actionCreators

export const TodoItem = ({ todo }: TodoItemProps) => {
  const [,, dispatch] = useTodos();

  const [editing, setEditing] = useState(() => false);

  const onDelete = useCallback(() => dispatch(deleteTodo(todo.id)), [todo.id])
  const onDone = useCallback(() => dispatch(toggleTodo(todo.id)), [todo.id])
  const onChange = useCallback(event => dispatch(setTodo({ ...todo, title: event.target.value })), [todo])

  const handleViewClick = useDoubleClick(null, () => setEditing(true))

  const finishedCallback = useCallback(() => {
    setEditing(false);
    dispatch(setTodo({ ...todo, title: todo.title.trim() }))
  }, [todo])

  const onEnter = useOnEnter(finishedCallback, [todo]);
  const ref = useRef<any>();
  useOnClickOutside(ref, finishedCallback);

  return (
    <li
      onClick={handleViewClick}
      className={`${editing ? "editing" : ""} ${todo.done ? "completed" : ""}`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.done}
          onChange={onDone}
          autoFocus={true}
        />
        <label>{todo.title}</label>
        <button className="destroy" onClick={onDelete} />
      </div>
      {editing && (
        <input
          ref={ref}
          className="edit"
          value={todo.title}
          onChange={onChange}
          onKeyPress={onEnter}
        />
      )}
    </li>
  );
};

