import React, { createContext, useContext, useReducer, Dispatch } from "react";
import produce from "immer";

import { useReducerWithLogs } from "../../../helpers/helpers";
import { ValueOf } from "../../../../types/ValueOf";
import { AsyncData, ContextProviderProps } from "../../../../types/contextHelpers";

import { TodoModel } from "../models/todo";
import { addTodo } from './todoAsyncActions'

// 1 ACTIONS

const ActionTypes = {
  TODOS_LOADED: "TODOS_LOADED",
  TODO_ADDED: "TODO_ADDED",
  TODO_SET: "TODOS_SET",
  TODO_TOGGLE_DONE: "TODO_TOGGLE_DONE",
  TODO_DELETED: "TODO_DELETED",
  LOADING: "LOADING",
  CLEAR: "CLEAR"
} as const

const actionCreators = {
  todosLoaded: (todos: TodoModel[]) => ({
    type: ActionTypes.TODOS_LOADED,
    payload: todos
  }),
  addedTodo: (todo: TodoModel) => ({
    type: ActionTypes.TODO_ADDED,
    payload: todo
  }),
  setTodo: (todo: TodoModel) => ({
    type: ActionTypes.TODO_SET,
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
const TodosDispatchContext = createContext<Dispatch<TodoAction> | null>(null);

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
      draft.todos.unshift(action.payload)
      return;
    case ActionTypes.TODO_SET:
      return {
        loading: false,
        todos: draft.todos.map(t =>
          t.id === action.payload.id
            ? action.payload
            : t
        )
      }
    case ActionTypes.TODO_TOGGLE_DONE:
      return {
        loading: false,
        todos: draft.todos.map(t =>
          t.id === action.payload
            ? { ...t, done: !t.done }
            : t
        )
      }
    case ActionTypes.LOADING:
      draft.loading = action.payload;
      return;
    case TODO_DELETED:
      return {
        todos: draft.todos.filter(t =>
          t.id !== action.payload
        )
      }
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
  const dispatch = useTodoDispatch()
  const { todos } = useTodoState()

  // for async actions
  const actions = {
    addTodoAsync: addTodo(dispatch),
    ...actionCreators
  }

  return [
    todos,
    actions,
    dispatch
  ] as [
      typeof todos,
      typeof actions,
      typeof dispatch
    ]
}

// for dispatching sync actions
useTodos.actionCreators = actionCreators;


export const TodoProvider = ({ children }: ContextProviderProps) => {
  // Using logging when in development
  let useCustomReducer = useReducerWithLogs;

  const isProd = false; // get from env var

  if (isProd) {
    useCustomReducer = useReducer;
  }

  const [state, dispatch] = useCustomReducer(todoReducer, initialState);

  return (
    <TodosStateContext.Provider value={state}>
      <TodosDispatchContext.Provider value={dispatch}>
        {children}
      </TodosDispatchContext.Provider>
    </TodosStateContext.Provider>
  );
};
