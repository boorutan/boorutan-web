import {useLocalStorage} from "@/hook/useLocalStorage";
import {useRouter, useSearchParams} from "next/navigation";
import {mergeObjectForce} from "@/lib/utils/object";
import {useState} from "react";
import {useEffectApi} from "@/hook/useApi";

export type BooruImageList = {
    like: boolean,
    tags: string,
    tagsRaw: Array<any> | null,
    booru: string,
    posts: Array<any>,
    postsBack: Array<any>,
    page: number,
    pageBack: number,
    bypassCache: boolean,
    query: string,
    maxSensitiveLevel: number,
    showSensitiveLevel: Array<number>,
    sensitiveFilterType: "hide" | "blur"
}
export type BooruImageListOption = {[key in keyof BooruImageList]?: BooruImageList[key]}

export const defaultBooruImageList: BooruImageList = {
    like: false,
    tags: "",
    tagsRaw: null,
    booru: "",
    posts: [],
    postsBack: [],
    page: 2,
    pageBack: 0,
    bypassCache: false,
    query: "",
    maxSensitiveLevel: 1,
    showSensitiveLevel: [],
    sensitiveFilterType: "blur"
}

export type Fn<T, Y = T> = ((value: T)=> Y)
export type V<T> = T
export type UpdateBooruSettingsFn =  Fn<BooruImageList, BooruImageListOption | Promise<BooruImageListOption> | void>

export const useBooruImageList = (onLoad?: Fn<BooruImageList, BooruImageListOption | Promise<BooruImageListOption> | void>): [BooruImageList | null, (s: Fn<BooruImageList, BooruImageListOption> | V<BooruImageListOption>)=> void] => {
    const router = useRouter()
    const query = useSearchParams()
    const [load, setLoad] = useState(false)
    const id = query.get("id") || crypto.randomUUID().slice(0, 5)
    const [settings, setSettings] = useLocalStorage<BooruImageList>(id , defaultBooruImageList, null)
    if(!query.get(id) && !settings) {
        router.replace(`/?id=${id}`)
    }
    const updateSettings = (settings: Fn<BooruImageList, BooruImageListOption> | V<BooruImageListOption>) => {
        if(settings instanceof Function) {
            return setSettings((v)=> mergeObjectForce(v, settings(v)))
        }
        setSettings((v)=> mergeObjectForce(v, settings))
    }
    useEffectApi(async ()=> {
        if(!load && settings && onLoad) {
            setLoad(true)
            const v = await onLoad(settings)
            updateSettings(v || {})
        }
    },[settings])
    return [settings, updateSettings]
}