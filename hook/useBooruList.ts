import {useLocalStorageList} from "@/hook/useLocalStorageList";
import {useEffect, useState} from "react";
import {BooruImageList} from "@/hook/useBooruImageList";
import {mergeObjectForce} from "@/lib/utils/object";

export const useBooruList = () => {
    const storageList = useLocalStorageList()
    const [boorus, setBoorus] = useState<Array<BooruImageList & {id: string}>>()
    useEffect(() => {
        const b = storageList
            .map((k)=> [k, localStorage.getItem(k)])
            .map(([id, raw])=> {
                try {
                    return mergeObjectForce({id},JSON.parse(raw as string))
                } catch (e) {
                    return undefined
                }
            })
            .filter((json) => Boolean(json))
            .filter((booru: BooruImageList)=> Array.isArray(booru.posts) && booru.page)
            .map((booru: BooruImageList & {
                id: string
            })=> {
                const diff = new Date() as any - (new Date(booru.lastUpdate) as any)
                const diff_day = diff / 1000 / 60 / 24
                if(
                    diff_day > 1
                    || !booru.lastUpdate
                ) {
                    localStorage.removeItem(booru.id)
                }
                return booru
            })
        setBoorus(b)
    }, [storageList]);
    return boorus
}