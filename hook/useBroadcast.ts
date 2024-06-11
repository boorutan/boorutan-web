import {Fn} from "@/lib/type/utils";
import {useEffect} from "react";

export enum Channel {
    tab,
    useWindowManager,
    useBooruManager
}

export const useBroadcast = <T>(c: Channel, fn: Fn<T, void | any>) => {
    const init = () => {
        let channel = new BroadcastChannel(["tab_channel", "windowmanager_channel", "boorumanager_channel"][c]);
        channel.onmessage =  (e)=> fn(JSON.parse(e.data))
        return channel
    }
    let channel = undefined as any
    useEffect(() => {
        channel = init()
        return () => channel.close()
    }, []);
    return [channel, (data: T)=> {
        if(channel == undefined) {
            channel = init()
        }
        channel.postMessage(JSON.stringify(data))
    }] as const
}