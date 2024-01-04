import { useEffect, useState } from "react"

type Fn<T> = ((value: T)=> T)
type V<T> = T

export const useLocalStorage = <T>(key: string, init?: T, loading?: any): [T, (value: Fn<T> | V<T>)=> void] => {
    const [state, setState] = useState<T>(loading === undefined ? init : loading)
    useEffect(()=> {
        setState(()=> {
            const value = localStorage.getItem(key)
            return value ? JSON.parse(value) : init
        })
    },[])
    return [state, (value: Fn<T> | V<T>)=> {
        if(value instanceof Function) {
            return setState((v)=> {
                const c = value(v)
                localStorage.setItem(key, JSON.stringify(c))
                return c
            })
        }
        localStorage.setItem(key, JSON.stringify(value))
        setState(value)
    }]
}