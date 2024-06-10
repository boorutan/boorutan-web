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

export const useWindowManager = (o?: {
    includeSelf?: boolean
}) => {
    const [windows, setWindows] = useState<Array<Window>>([])
    const query = useSearchParams()
    const [channel, push] = useBroadcast<Window>(Channel.useWindowManager, (e)=> {
        if(includes(windows, e)) {
            setWindows((ws)=> updateWindow(ws, e))
            return
        }
        setWindows((ws)=> deleteDupe([e, ...ws]))
    })

    const deleteDupe = (ws: Array<Window>) => {
        return ws.reduce((acc, v)=> {
            if(includes(acc, v)) {
                return acc
            }
            return [...acc, v]
        }, [] as Array<Window>)
    }
    const updateWindow = (ws: Array<Window>, w: Window) => {
        return windows.map((v)=> {
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
    useLoop(()=> {
        const id = query.get("id")
        if(!id)
            return
        push({
            id,
            lastUpdate: new Date()
        })
        setWindows((w)=> clearWindow(w))
    }, 500)
    return windows.filter((v)=> o?.includeSelf || v.id != query.get("id"))
}