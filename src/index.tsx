import React from "react";
import { render } from "react-dom";
import TodoPage from "./Pages/todo/todoPage";
import "todomvc-app-css/index.css";

const App = () => (
  <div className="todoapp">
    <TodoPage />
  </div>
);

const rootElm = document.getElementById("root");

render(<App />, rootElm);
