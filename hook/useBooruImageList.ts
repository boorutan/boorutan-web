import {useLocalStorage} from "@/hook/useLocalStorage";
import {useRouter, useSearchParams} from "next/navigation";
import {mergeObjectForce} from "@/lib/utils/object";

export type BooruImageList = {
    like: boolean,
    tags: string,
    booru: string,
    posts: Array<any>,
    page: number,
    bypassCache: boolean
}
export type BooruImageListOption = {[key in keyof BooruImageList]?: BooruImageList[key]}

const defaultBooruImageList: BooruImageList = {
    like: false,
    tags: "",
    booru: "",
    posts: [],
    page: 2,
    bypassCache: false
}

type Fn<T, Y = T> = ((value: T)=> Y)
type V<T> = T

export const useBooruImageList = (): [BooruImageList, (s: Fn<BooruImageList, BooruImageListOption> | V<BooruImageListOption>)=> void] => {
    const router = useRouter()
    const query = useSearchParams()
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
    console.log(settings)
    return [settings, updateSettings]
}