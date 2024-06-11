import {Channel, useBroadcast} from "@/hook/useBroadcast";
import {Fn} from "@/lib/type/utils";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";

type Window = {
    id: string,
    lastUpdate: Date
}

const useLoop = (fn: Fn<void, void | Fn<void>>, t: number, e?: Fn<void, void>) => {
    useEffect(() => {
        const interval = setInterval(()=> {
            const f = fn()
            f && f()
        }, t)
        return ()=> {
            clearTimeout(interval)
        }
    }, []);
}

const deleteDupe = (ws: Array<Window>) => {
    return ws.reduce((acc, v)=> {
        if(includes(acc, v)) {
            return acc
        }
        return [...acc, v]
    }, [] as Array<Window>)
}
const updateWindow = (ws: Array<Window>, w: Window) => {
    return ws.map((v)=> {
        if(v.id == w.id) return w
        return v
    })
}
const includes = (ws: Array<Window>,w: Window) => {
    return Boolean(ws.find((v)=> v.id == w.id))
}
const clearWindow = (ws: Array<Window>) => {
    const now = new Date()
    return ws.filter((v)=> {
        const diff = now as any - (new Date(v.lastUpdate) as any)
        return diff / 1000 <= 3;

    })
}

export const useWindowManager = (o?: {
    includeSelf?: boolean
}) => {
    let windowsCore: Array<Window> = []
    const [windows, setWindows] = useState<Array<Window>>([])
    const query = useSearchParams()
    const [channel, push] = useBroadcast<Window>(Channel.useWindowManager, (e)=> {
        if(includes(windowsCore, e)) {
            windowsCore = updateWindow(windowsCore, e)
            //setWindows((ws)=> updateWindow(ws, e))
            return
        }
        //setWindows((ws)=> deleteDupe([e, ...ws]))
        windowsCore = deleteDupe([e, ...windowsCore])
    })

    useLoop(()=> {
        const id = query.get("id")
        if(!id)
            return
        push({
            id,
            lastUpdate: new Date()
        })
        //setWindows((w)=> clearWindow(w))
        setWindows(clearWindow(windowsCore))
    }, 100)
    return windows.filter((v)=> o?.includeSelf || v.id != query.get("id"))
}