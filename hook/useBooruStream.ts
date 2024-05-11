import {useEffect} from "react";
import {useLocalStorage} from "@/hook/useLocalStorage";

export type BooruStream = {
    posts: Array<any>,
}
const defaultBooruStream: BooruStream = {
    posts: []
}

export const useBooruStream = (): BooruStream => {
    const [booru, setBooru] = useLocalStorage<BooruStream>("stream", defaultBooruStream)
    useEffect(() => {
        const url = "//api-booru.i32.jp/post/stream"
        let evtSource = new EventSource(url)
        evtSource.onmessage = (e) => {
            const post = JSON.parse(e.data)
            setBooru((booru)=> ({posts: [post, ...booru.posts.slice(0, 100)]}))
        }
        evtSource.onerror = (e) => {
            evtSource.close()
            evtSource = new EventSource(url)
        }
        return ()=> evtSource.close()
    }, []);
    return booru
}