import React, { createContext, useContext, useReducer, Dispatch } from "react";
import produce from "immer";

import { useReducerWithLogs } from "../../helpers/helpers";
import { ValueOf } from "../../types/ValueOf";
import { AsyncData, ContextProviderProps } from "../../types/contextHelpers";

import { TodoModel } from "../models/todo";

// 1 ACTIONS

const ActionTypes = {
  TODOS_LOADED: "TODOS_LOADED",
  TODO_ADDED: "TODO_ADDED",
  TODO_DONE: "TODOS_DONE",
  TODO_TOGGLE_DONE: "TODO_TOGGLE_DONE",
  TODO_DELETED: "TODO_DELETED",
  LOADING: "LOADING",
  CLEAR: "CLEAR"
} as const;

const actionCreators = {
  todosLoaded: (todos: TodoModel[]) => ({
    type: ActionTypes.TODOS_LOADED,
    payload: todos
  }),
  addedTodo: (todo: TodoModel) => ({
    type: ActionTypes.TODO_ADDED,
    payload: todo
  }),
  todoSetDone: (todo: TodoModel) => ({
    type: ActionTypes.TODO_DONE,
    payload: todo
  }),
  toggleTodo: (id: string) => ({
    type: ActionTypes.TODO_TOGGLE_DONE,
    payload: id
  }),
  deleteTodo: (id: string) => ({
    type: ActionTypes.TODO_DELETED,
    payload: id
  }),
  loading: (loading: boolean) => ({
    type: ActionTypes.LOADING,
    payload: loading
  }),
  clearTodos: () => ({ type: ActionTypes.CLEAR })
} as const;

export type TodoAction = ReturnType<ValueOf<typeof actionCreators>>;

// 2 STATE

type TodoState = {
  todos: TodoModel[];
} & AsyncData;

// CREATE REACT CONTEXTS FOR STATE & DISPATCH
const TodosStateContext = createContext<TodoState | null>(null);
const TodosDispatchContext = createContext<Dispatch<TodoState> | null>(null);

const initialState: TodoState = {
  todos: [],
  loading: false
};

// REDUCER IMPLEMENTATION using immer produce
const todoReducer = produce((draft: TodoState, action: TodoAction) => {
  const { TODO_DELETED } = ActionTypes;

  switch (action.type) {
    case ActionTypes.TODOS_LOADED:
      draft.todos = action.payload;
      draft.loading = false;
      return; // returning nothing when only modifying state
    case ActionTypes.TODO_ADDED:
      draft.todos.unshift(action.payload);
      return;
    case ActionTypes.TODO_DONE:
      draft.loading = false;
      return;
    case ActionTypes.TODO_TOGGLE_DONE:
      draft.loading = false;
      return;
    case ActionTypes.LOADING:
      draft.loading = action.payload;
      return;
    case TODO_DELETED:
      return;
    case ActionTypes.CLEAR:
      return initialState; // returning anything replaces state
  }
});

//  STATE CONTEXT HOOK
const useTodoState = () => {
  const context = useContext(TodosStateContext);
  if (!context) {
    throw new Error(`useTodoState must be used within a TodoProvider`);
  }
  return context;
};

// DISPATCH CONTEXT HOOK
const useTodoDispatch = () => {
  const context = useContext(TodosDispatchContext);
  if (!context) {
    throw new Error(`useTodoDispatch must be used within a TodoProvider`);
  }
  return context;
};

// USE TODO - COMBINE STATE & DISPATCH CONTEXT CONSUMER HOOKS + create async actions

export const useTodos = () => {
  const dispatch = useTodoDispatch();

  // for async actions
  const actions = {};

  return [useTodoState(), actions, dispatch] as [
    ReturnType<typeof useTodoState>,
    typeof actions,
    typeof dispatch
  ];
};

// for dispatching sync actions
useTodos.actionCreators = actionCreators;

const TodosStateContextProvider = TodosStateContext.Provider
const TodosDispatchContextProvider = TodosDispatchContext.Provider

export const TodoProvider = ({ children }: ContextProviderProps) => {
  // Using logging when in development
  let useCustomReducer = useReducerWithLogs;

  const isProd = false; // get from env var

  if (isProd) {
    useCustomReducer = useReducer;
  }

  const [state, dispatch] = useCustomReducer(todoReducer, initialState);

  return (
    <TodosStateContextProvider value={state}>
      <TodosDispatchContextProvider value={dispatch}>
        {children}
      </TodosDispatchContextProvider>
    </TodosStateContextProvider>
  );
};
