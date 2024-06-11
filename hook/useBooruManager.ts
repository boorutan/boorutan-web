import {Channel, useBroadcast} from "@/hook/useBroadcast";
import {useRouter, useSearchParams} from "next/navigation";
import {Router} from "next/router";
import {Fn, Option} from "@/lib/type/utils";
import {BooruImageList, BooruImageListOption} from "@/hook/useBooruImageList";
import {replaceXwithY} from "@/lib/utils/string";

export enum OperationType {
    openPostModal,
    appendTag,
}

type BooruManagerChannelMessage = {
    type: OperationType,
    data: any,
    target: string
}

export const execute = (op: BooruManagerChannelMessage, option: {
    router: any,
    setSettings?: (s: BooruImageListOption | Fn<BooruImageList, BooruImageListOption>) => void
}) => {
    const id = op.target
    if(op.type == OperationType.openPostModal) {
        option.router.push(op.data.concat(`?id=${id}`))
    }
    if(op.type == OperationType.appendTag) {
        option.setSettings && option.setSettings((s)=> ({
            tags: `${op.data.name} `.concat(replaceXwithY(s.tagsRaw?.reduce((acc, v)=> {
                    if(op.data.category == "1" && v.category == "1") {
                        return replaceXwithY(acc, v.name, "")
                    }
                    return acc
                }, s.tags) || "", op.data.name, "")),
            tagsRaw: [op.data].concat((s.tagsRaw?.filter((v)=> op.data.category != "1" || v.category != "1") || []).filter((t)=> t.name != op.data.name)),
            posts: [],
            page: 2,
            pageBack: 0,
            postsBack: []
        }))
        option.router.push(`/?id=${op.target}`)
        const interval = setInterval(()=> {
            location.reload()
            clearInterval(interval)
        }, 100)
    }
}

export const useBooruManager = (o?: {
    setSettings?: (s: BooruImageListOption | Fn<BooruImageList, BooruImageListOption>) => void
}) => {
    const router = useRouter()
    const query = useSearchParams()
    const id = query.get("id")
    const [channel, send] = useBroadcast<BooruManagerChannelMessage>(Channel.useBooruManager, (msg)=> {
        if(msg.target != id)
            return
        execute(msg, {
            router,
            setSettings: o?.setSettings
        })
    })
    return (operation: BooruManagerChannelMessage)=> {
        send(operation)
    }
}