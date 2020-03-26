import React, { Fragment } from "react";
import { TodoItem } from './todoItem'
import { useTodos } from './state/todoContext'

export const TodoPage = () => {
  const [todos] = useTodos();
  return (
    <Fragment>
      <header className="header">
        <h1>todos</h1>
      </header>

      <section className="main">
        <input 
        id="toggle-all" 
        type="checkbox" 
        className="toggle-all" 
        />
        <label htmlFor="toggle-all" />
      </section>

           <footer className="footer">
        <span className="todo-count">
          { //<strong>{left}</strong> items left
          }
        </span>
        <ul className="filters">
          <li>
              All
          </li>
          <li>
              Active
          </li>
          <li>
              Completed
          </li>
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
