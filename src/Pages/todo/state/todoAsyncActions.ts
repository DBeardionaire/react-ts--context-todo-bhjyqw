import { Dispatch } from "react";
import { v4 } from "uuid";
import { TodoModel } from "../models/todo";
import { TodoAction, useTodos } from "./todoContext";
import { delayPromise } from "../../../helpers/helpers";

const newTodo = (title: string = "") =>
  ({
    done: false,
    id: v4(),
    title: title.trim()
  } as TodoModel);

export const fetchTodos = (dispatch: Dispatch<TodoAction>) => async (
  query?: any
) => {
  const { loading, todosLoaded } = useTodos.actionCreators;

  try {
    dispatch(loading(true));

    const result: TodoModel[] = await delayPromise(2000)(query).then(
      // fake result from server
      () => [
        newTodo("Something needs to be done"),
        newTodo("GET MOAR TP!"),
        newTodo("Invest in a bidet company!")
      ]
    );

    dispatch(todosLoaded(result));
    dispatch(loading(false));
  } catch (e) {
    console.error("fetchTodosAsync", e);
  }
};

export const addTodo = (dispatch: Dispatch<TodoAction>) => async (
  title: string
) => {
  const { loading, addedTodo } = useTodos.actionCreators;

  try {
    dispatch(loading(true));

    const result: TodoModel = await delayPromise(2000)(title).then(() => newTodo(title));

    dispatch(addedTodo(result));
    dispatch(loading(false));
  } catch (e) {
    console.error("addTodoAsync", e);
  }
};
