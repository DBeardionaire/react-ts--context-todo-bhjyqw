import { useReducer } from 'react'

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