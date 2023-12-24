"use client"

import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ImageLines from './imagelines';
import { req } from '@/lib/fetch';
import { getSampleUrl } from '@/lib/booru';
import useScrollPosition from '@/hook/useScrollPosition';
import useScrollDirection from '@/hook/useScrollDirection';
import {useRouter} from "next/navigation";
import {useEffectApi} from "@/hook/useApi";
import {quickSort} from "@/lib/sort";

type init = {
    tags: any,
    posts: any
}
const WarpTop = () => {
    const direction = useScrollDirection()
    const scroll = useScrollPosition()
    return <div onClick={()=> {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }} style={{
        width: 105,
        height: 36,
        position: "fixed",
        left: "calc(50% - ( 160px / 2 ))",
        top: 10,
        backgroundColor: "#1d9bf0",
        borderRadius: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "2px 10px",
        paddingRight: 21,
        cursor: "pointer",
        transition: "transform .3s ease",
        transform: scroll < 1000 || !direction ? "translateY(-100px)" :  "",
    }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-up" width="21" height="21" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M18 11l-6 -6" />
            <path d="M6 11l6 -6" />
        </svg>
        <p style={{
            margin: 0,
            lineHeight: 1,
            color: "#fff"
        }}>Warp top</p>
    </div>
}

const SelectorButton = ({ children, active, onClick }:{
    children: any,
    active?: boolean,
    onClick?: (e: any) => void
}) => {
    return <div onClick={(e)=> onClick && onClick(e)} style={{
        padding: "16px 32px",
        border: "1px solid #eee",
        width: "fit-content",
        borderRadius: 100,
        backgroundColor: active ? "#f5f5f5" : "#fff",
        cursor: "pointer",
        whiteSpace: "nowrap"
    }}>
        <p style={{
            margin: 0,
            width: "fit-content",
            lineHeight: 1
        }}>{ children }</p>
    </div>
}

type suggest = {
    category: string,
    created_at: string,
    is_locked: boolean,
    name: string,
    post_count: string,
    updated_at: string
}[]

const color: any = {
    "0": "#2196F3", // general
    "1": "#E91E63", // artist
    "2": "#FFEB3B", // invalid
    "3": "#9C27B0", // copyright
    "4": "#4CAF50", // character
    "5": "#FFEB3B", // meta
}

const Selector = ({init, onChange}:{
    init: init,
    onChange?: (tag: string, booru: string, like: boolean, bypassCache: boolean) => void
}) => {
    const [like, setLike] = useState(false)
    const [query, setQuery] = useState("")
    const [suggest, setSuggest] = useState<suggest>([])

    const [tag, setTag] = useState<null | Array<{
        category: string,
        name: string,
        post_count: string
    }>>(null)
    const [booru, setBooru] = useState("")

    const [bypassCache, setBypassCache] = useState(false)

    /*const [tags, setTags] = useState(init.tags.concat([
        {
            name: "loli"
        }
    ]))*/
    const [tags, setTags] = useState([
        { name: "loli" },
        { name: "hololive" },
        { name: "cirno" }
    ])
    const [showMore, setShowMore] = useState(false)
    useEffect(() => {
        onChange && onChange(tag ? tag.map((v)=> v.name).join(" ") : "", booru, like, bypassCache)
    }, [tag, booru, onChange, like, bypassCache]);
    const boorus = [
        {
            name: "Danbooru",
            id: "danbooru",
        },
        {
            name: "SafeKonachan",
            id: "safekonachan"
        },
        {
            name: "Konachan",
            id: "konachan",
        },
        {
            name: "Yandere",
            id: "yandere"
        },
        {
            name: "Lolibooru",
            id: "lolibooru",
        }
    ]
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const res: suggest = await req(`/tag/suggest?q=${query}`)
            if(!Array.isArray(res))
                    return
            const sorted = quickSort(res, (a, b)=> Number(a.post_count) > Number(b.post_count))
            setSuggest(sorted)
            // Send Axios request here
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    }, [query])
    console.log(tag)
    return <div style={{
        gap: 12,
        display: "flex",
        flexDirection: "column",
        maxWidth: "100vw"
    }}>
        <div style={{
            display: "flex",
            gap: 12,
            padding: 8,
            border: "1px solid #eee ",
            width: "fit-content",
            borderRadius: 100,
            overflowX: "auto",
            maxWidth: "calc(100vw - 32px - 16px)"
        }}>
            {boorus.map((b, i) => <SelectorButton onClick={()=> {
                setBooru(b.id)
            }} key={i} active={booru==""?!i:booru==b.id}>{b.name}</SelectorButton>)}
        </div>
        <div style={{
            display: "flex",
            gap: 12,
            padding: 8,
            border: "1px solid #eee ",
            borderRadius: 100,
            overflowX: "auto",
            maxWidth: "calc(100vw - 32px - 16px)",
            width: "fit-content"
        }}>
            <input value={query} onChange={(e)=> {
                setQuery(e.target.value)
            }} style={{
                height: 44,
                maxWidth: 500,
                borderRadius: 100,
                border: "1px solid #f5f5f5",
                outline: "none",
                paddingLeft: 16,
                fontFamily: "ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace",
                fontSize: "1em",
                padding: "2px 32px"
            }} type="text" />
            {quickSort(suggest, (a, b)=> Number.parseInt(a.post_count) > Number.parseInt((b.post_count))).slice(0, 3).map((b: any, i: any) => <SelectorButton onClick={()=> {
                setTag((tag)=> {
                    if(!tag) return [b]
                    if(tag.map((v)=> v.name).includes(b.name)) {
                        return tag.filter((v)=> v.name != b.name)
                    }
                    return [b].concat(tag)
                })
                //setTag((name)=> b.name==name?"":b.name)
            }} key={i} active={tag?.map((v)=> v.name).includes(b.name)}><span style={{color: color[b.category]}}>{b.name}</span> {b.post_count}</SelectorButton>)}
            <SelectorButton onClick={()=> {
                setTag((tag)=> {
                    const t = {
                        name: query,
                        category: "5",
                        post_count: "0"
                    }
                    if(!tag) return [t]
                    if(tag.map((v)=> v.name).includes(t.name)) {
                        return tag.filter((v)=> v.name != t.name)
                    }
                    return [t].concat(tag)
                })
                //setTag((name)=> name=="" ? query : "")
            }} active={tag?.map((v)=> v.name).includes(query)}>{query}</SelectorButton>
        </div>
        {(tag && !!tag.length) && <div style={{
            display: "flex",
            gap: 12,
            padding: 8,
            border: "1px solid #eee ",
            borderRadius: 100,
            overflowX: "auto",
            maxWidth: "calc(100vw - 32px - 16px)",
            width: "fit-content"
        }}>
            {tag?.map((b, i) => <SelectorButton onClick={()=> {
                setTag((tag)=> {
                    if(!tag) return null
                    return tag.filter((v)=> v.name != b.name)
                })
                //setTag((name)=> b.name==name?"":b.name)
            }} key={i} active={true}><span style={{color: color[b.category]}}>{b.name}</span></SelectorButton>)}
        </div>}
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12
        }}>
            <div style={{
                display: "flex",
                flexWrap: showMore ? "wrap" : "nowrap",
                gap: 12,
                padding: 8,
                border: "1px solid #eee ",
                width: "fit-content",
                borderRadius: 32,
                overflowX: "auto",
                maxWidth: "calc(100vw - 32px - 16px)",
                transition: "all .3s ease"
            }}>
                {tags.slice(0, showMore ? 30 : 4).map((b: any, i: any) => <SelectorButton onClick={()=> {
                    setTag((name)=> b.name==name?"":b.name)
                }} key={i} active={tag==b.name}>{b.name}</SelectorButton>)}
                {!showMore && <SelectorButton onClick={()=> {
                    setShowMore((s)=> !s)
                }} active>Show more</SelectorButton>}
            </div>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                padding: 8,
                border: "1px solid #eee ",
                width: "fit-content",
                borderRadius: 32,
                overflowX: "auto",
                maxWidth: "calc(100vw - 32px - 16px)",
                transition: "all .3s ease"
            }}>
                <SelectorButton onClick={()=> {
                    setLike((l)=> !l)
                }} active={like}>Liked</SelectorButton>
            </div>
        </div>
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            padding: 8,
            border: "1px solid #eee ",
            width: "fit-content",
            borderRadius: 32,
            overflowX: "auto",
            maxWidth: "calc(100vw - 32px - 16px)",
            transition: "all .3s ease"
        }}>
            <SelectorButton onClick={()=> {
                setBypassCache((v)=> !v)
            }} active={bypassCache}>BypassCache</SelectorButton>
        </div>
    </div>
}

const BooruImageInfinite = ({init}: {
    init: init
}) => {
    const [like, setLike] = useState(false)
    const [tags, setTags] = useState("")
    const [booru, setBooru] = useState("")
    const [posts, setPosts] = useState<Array<any>>(init.posts)
    const [wait, setWait] = useState<boolean>(false)
    const [page, setPage] = useState(2)
    const [bypassCache, setBypassCache] = useState(false)
    useEffect(()=> {
        const interval = setInterval(()=> {
            setWait(false)
        }, 1000)
        return ()=> clearInterval(interval)
    },[])
    return <InfiniteScroll
        pageStart={1}
        hasMore={!wait}
        loadMore={async (id)=> {
            if(like)
                return setWait(true)
            const posts: Array<any> = await req<any>(`/${like ? "like" : "post"}?page=${page}&booru=${booru}&tags=${tags}`)
            setPosts((ps)=> ps.concat(posts.filter((p)=> !!getSampleUrl(p))))
            setPage((page: number)=> page + 1)
            setWait(true)
        }}
        initialLoad={false}
    >
        <div style={{
            padding: 16
        }}>
            <Selector onChange={async (t, b, l, c)=> {
                if(t==tags&&b==booru&&l==like&&c==bypassCache) return
                window.scrollTo({ top: 0 })
                setTags(t)
                setBooru(b)
                setLike(l)
                setBypassCache(c)

                const p: Array<any> = await req<any>(`/${l ? "like" : "post"}?page=${1}&booru=${b}&tags=${t}${c?"&bypasscache=true":""}`)
                setPosts((ps)=> p.filter((p)=> !!getSampleUrl(p)))
                setWait(true)
                setPage(2)
            }} init={init} />
        </div>
        <WarpTop />
        <ImageLines booru={booru || "danbooru"} posts={posts} line_length={3} />
    </InfiniteScroll>
}
export {
    BooruImageInfinite as default
}