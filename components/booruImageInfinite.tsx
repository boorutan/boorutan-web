"use client"

import {useEffect, useRef, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ImageLines from './imagelines';
import { req } from '@/lib/fetch';
import { getSampleUrl } from '@/lib/booru';
import useScrollPosition from '@/hook/useScrollPosition';
import useScrollDirection from '@/hook/useScrollDirection';
import {useRouter} from "next/navigation";
import {useEffectApi} from "@/hook/useApi";
import {quickSort} from "@/lib/sort";
import {BooruImageList, BooruImageListOption, defaultBooruImageList, useBooruImageList} from "@/hook/useBooruImageList";
import {Selector} from "@/components/booruSelector";
import {getPost} from "@/lib/booruPost";
import {useAccount} from "@/hook/useAccount";
import {useBooruList} from "@/hook/useBooruList";
import {useBooruManager} from "@/hook/useBooruManager";
import {useWindowManager} from "@/hook/useWindowManager";

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
        zIndex: 100
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

const BooruImageInfinite = ({init}: {
    init: init
}) => {
    const scrollSelector = () => {
        console.log(ref.current.offsetTop)
        window.scrollTo({
            top: ref.current.offsetTop // - window.innerHeight - ref.current.offsetHeight
        })
    }

    const [wait, setWait] = useState<boolean>(false)
    const [isShowHistory, setIsShowHistory] = useState(false)
    const [account, setAccount] = useAccount()
    const boorusStorage = useBooruList()
    const [settings, setSettings] = useBooruImageList(async (s)=> {
        const basePage = s.page - s.pageBack
        //const posts: Array<any> = await req<any>(`/${s.like ? "like" : "post"}?page=${basePage - 1}&booru=${s.booru}&tags=${s.tags}${s.bypassCache?"&bypasscache=true":""}`)
        const posts = await getPost(account, {
            ...s,
            page: basePage - 1
        })
        if(basePage <= 2) {
            setIsShowHistory(false)
            return {
                posts: posts.filter((p)=> !!getSampleUrl(p)),
                page: basePage,
                pageBack: 0,
                postsBack: []
            }
        }
        setIsShowHistory(true)
        //const postsBack: Array<any> = await req<any>(`/${s.like ? "like" : "post"}?page=${basePage - 2}&booru=${s.booru}&tags=${s.tags}${s.bypassCache?"&bypasscache=true":""}`)
        const postsBack = await getPost(account, {
            ...s,
            page: basePage - 2
        })
        const interval = setInterval(()=> {
            scrollSelector()
            clearInterval(interval)
        }, 50)
        return {
            posts: posts.filter((p)=> !!getSampleUrl(p)),
            page: basePage,
            pageBack: 0,
            postsBack: postsBack.filter((p)=> !!getSampleUrl(p)).reverse()
        }
    })
    const {like, tags, booru, posts, page, bypassCache, pageBack, postsBack} = settings || defaultBooruImageList
    const ref = useRef<any>(null)

    const manager = useBooruManager({
        setSettings
    })
    const wnidows = useWindowManager()

    useEffect(()=> {
        const interval = setInterval(()=> {
            setWait(false)
        }, 1000)
        return ()=> clearInterval(interval)
    },[])
    return <div>
        {isShowHistory && <div style={{
            display: "flex",
            flexDirection: "column-reverse",
        }}>
            <InfiniteScroll
                pageStart={1}
                hasMore={!wait && (page - pageBack - 3 >= 0)}
                loadMore={async (id)=> {
                    if(page - pageBack - 3 == 0) {
                        setSettings((s)=> ({
                            pageBack: s.pageBack + 1
                        }))
                        return
                    }
                    if(like)
                        return setWait(true)
                    //const posts: Array<any> = await req<any>(`/${like ? "like" : "post"}?page=${page - pageBack - 3}&booru=${booru}&tags=${tags}${bypassCache?"&bypasscache=true":""}`)
                    const posts = await getPost(account, {
                        ...settings,
                        page: page - pageBack - 3
                    })
                    setSettings((s)=> ({
                        postsBack: s.postsBack.concat(posts.filter((p)=> !!getSampleUrl(p)).reverse()),
                        pageBack: s.pageBack + 1
                    }))
                    setWait(true)
                }}
                initialLoad={false}
                isReverse={true}
            >
                <ImageLines account={account} showSensitiveLevel={settings?.showSensitiveLevel} isReverse={true} booru={booru || "danbooru"} posts={postsBack} line_length={3} />
            </InfiniteScroll>
        </div>}
        <div ref={ref} style={{
            padding: 16
        }}>
            <Selector account={account} setAccount={setAccount} updateValue={setSettings} value={settings} onChange={async (v)=> {
                //const p: Array<any> = await req<any>(`/${v.like ? "like" : "post"}?page=${1}&booru=${v.booru}&tags=${v.tags}${v.bypassCache?"&bypasscache=true":""}`)
                const p = await getPost(account, {
                    ...v,
                    page: 1
                })
                setSettings((s)=> ({
                    tags: v.tags,
                    booru: v.booru,
                    like: v.like,
                    bypassCache: v.bypassCache,
                    posts: p.filter((p)=> !!getSampleUrl(p)),
                    page: 2,
                    pageBack: 0,
                    postsBack: [],
                    tagsRaw: v.tagsRaw,
                    query: v.query
                }))
                const interval = setInterval(()=> {
                    scrollSelector()
                    clearInterval(interval)
                }, 50)
                setWait(true)
            }} init={init} />
        </div>
        <WarpTop />
        <InfiniteScroll
            pageStart={1}
            hasMore={!wait}
            loadMore={async (id)=> {
                if(like)
                    return setWait(true)
                //const posts: Array<any> = await req<any>(`/${like ? "like" : "post"}?page=${page}&booru=${booru}&tags=${tags}${bypassCache?"&bypasscache=true":""}`)
                const posts = await getPost(account, {
                    ...settings
                })
                setSettings((s)=> ({
                    posts: s.posts.concat(posts.filter((p)=> !!getSampleUrl(p))),
                    page: s.page + 1
                }))
                setWait(true)
            }}
            initialLoad={false}
        >
            <ImageLines account={account} showSensitiveLevel={settings?.showSensitiveLevel} booru={booru || "danbooru"} posts={posts} line_length={3} />
        </InfiniteScroll>
    </div>
}
export {
    BooruImageInfinite as default
}