export type Option<T> = {[key in keyof T]?: T[key]}
export type Fn<T, Y = T> = ((value: T)=> Y)
export type V<T> = T
export type UpdateFn<T> =  Fn<T, Option<T> | Promise<Option<T>> | void>

/*
import {Channel, useBroadcast} from "@/hook/useBroadcast";
import {Fn} from "@/lib/type/utils";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";

type Window = {
    id: string,
    lastUpdate: Date
}

const useLoop = (fn: Fn<void, void>, t: number) => {
    useEffect(() => {
        const interval = setInterval(()=> {
            fn()
        }, t)
        return ()=> clearTimeout(interval)
    }, []);
}

export const useWindowManager = () => {
    let windows: Array<Window> = []
    const [windowsState, setWindowsState] = useState<Array<Window>>([])
    const query = useSearchParams()
    const [channel, push] = useBroadcast<Window>(Channel.useWindowManager, (e)=> {
        if(includes(e)) {
            windows = updateWindow(windows, e)
            return
        }
        windows = [...windows, e]
        setWindowsState(windows)
    })
    const updateWindow = (ws: Array<Window>, w: Window) => {
        return windows.map((v)=> {
            if(v.id == w.id) return w
            return v
        })
    }
    const includes = (w: Window) => {
        return Boolean(windows.find((v)=> v.id == w.id))
    }
    const clearWindow = (ws: Array<Window>) => {
        const now = new Date()
        return ws.filter((v)=> {
            const diff = now as any - (new Date(v.lastUpdate) as any)
            return diff / 1000 <= 3;
        })
    }
    useLoop(()=> {
        const id = query.get("id")
        if(!id)
            return
        push({
            id,
            lastUpdate: new Date()
        })
        windows = clearWindow(windows)
    }, 100)
    return windowsState
}
 */