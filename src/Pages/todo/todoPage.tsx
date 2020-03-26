import React, { Fragment } from "react";
import { TodoItem } from "./todoItem";
import { useTodos, TodoProvider } from "./state/todoContext";
import { TodoModel } from "./models/todo";
import { useInput, useOnEnter } from '../../helpers/helpers'

export const TodoPage = () => {
  const [{ todos }, { addTodoAsync }] = useTodos();

  const [newValue, onNewValueChange, setNewValue] = useInput('')
  const onAddTodo = useOnEnter(
    () => {
      if (newValue) {
        addTodoAsync(newValue);
        setNewValue("");
      }
    },
    [newValue]
  );

  return (
    <Fragment>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyPress={onAddTodo}
          value={newValue}
          onChange={onNewValueChange}
        />
      </header>

      <section className="main">
        <input id="toggle-all" type="checkbox" className="toggle-all" />
        <label htmlFor="toggle-all" />
        <ul className="todo-list">
          {
            //   visibleTodos.map(todo => (
            //   <TodoItem key={todo.id} todo={todo} />
            // ))
          }
          {
            todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))
          }
        </ul>
      </section>

      <footer className="footer">
        <span className="todo-count">
          {
            //<strong>{left}</strong> items left
          }
        </span>
        <ul className="filters">
          <li>All</li>
          <li>Active</li>
          <li>Completed</li>
        </ul>
        {
          //   anyDone && (
          //   <button className="clear-completed" onClick={onClearCompleted}>
          //     Clear completed
          //   </button>
          // )
        }
      </footer>
    </Fragment>
  );
};

const TodoPageWithContext = () => (
  <TodoProvider>
    <TodoPage />
  </TodoProvider>
)

export default TodoPageWithContext;
