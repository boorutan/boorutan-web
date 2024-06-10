import {Fn} from "@/lib/type/utils";

export enum Channel {
    tab,
    useWindowManager,
    useBooruManager
}

export const useBroadcast = <T>(c: Channel, fn: Fn<T, void | any>) => {
    const channel = new BroadcastChannel(["tab_channel", "windowmanager_channel", "boorumanager_channel"][c]);
    channel.onmessage =  (e)=> fn(JSON.parse(e.data))
    return [channel, (data: T)=> {
        channel.postMessage(JSON.stringify(data))
    }] as const
}