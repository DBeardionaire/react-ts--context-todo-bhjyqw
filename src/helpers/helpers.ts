import { useReducer, useCallback, useState } from "react";

export const delayPromise = (duration: number) =>
  (...args: any) => new Promise((resolve) => setTimeout(() => resolve(...args), duration))


export const useReducerWithLogs = <T extends Parameters<typeof useReducer>>(reducer: T[0], initialState: T[1]) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const dispatchWithLog = (action: any) => {
    console.table([{ type: action.type, payload: action.payload }])
    return dispatch(action);
  }

  return [state, dispatchWithLog]
}


export const useInput = (defaultValue = '') => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(event => {
    setValue(event.target.value);
  }, [setValue])

  return [value, onChange, setValue] as [
    string,
    typeof onChange,
    typeof setValue
  ];
}

export const useOnEnter = (callback: any, inputs: any[]) => {
  return useCallback(event => {
    if (event.key === "Enter") {
      event.preventDefault();
      callback(event);
    }
  }, inputs);
}

export const useDoubleClick = (onClick: any, onDoubleClick: any) => {
  let clicks = [] as any[];
  let timeout: any

  return (event: any, ...rest: any) => {
    clicks.push(new Date().getTime());

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (
        clicks.length > 1 &&
        clicks[clicks.length - 1] - clicks[clicks.length - 2] < 250
      ) {
        if (onDoubleClick) {
          onDoubleClick(event, ...rest);
        }
      } else if (onClick) {
        onClick(event, ...rest);
      }
      clicks = [];
    }, 250);
  };
}