"use client"

import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ImageLines from './imagelines';
import { req } from '@/lib/fetch';
import { getSampleUrl } from '@/lib/booru';
import useScrollPosition from '@/hook/useScrollPosition';

const WarpTop = () => {
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
        transform: scroll < 1000 ? "translateY(-100px)" :  "",
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

const SelectorButton = ({ children, active }:{
    children: any,
    active?: boolean
}) => {
    return <div style={{
        padding: "16px 32px",
        border: "1px solid #eee",
        width: "fit-content",
        borderRadius: 100,
        backgroundColor: active ? "#f5f5f5" : "#fff"
    }}>
        <p style={{
            margin: 0,
            width: "fit-content",
            lineHeight: 1
        }}>{ children }</p>
    </div>
}
const Selector = () => {
    const booru = [
        {
            name: "Danbooru",
        },
        {
            name: "Moebooru"
        },
        {
            name: "Lolibooru"
        }
    ]
    return <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
    }}>
        {booru.map((b, i)=> <SelectorButton active={!i}>{b.name}</SelectorButton>)}
    </div>
}

const BooruImageInfinite = ({init}: {
    init: any
}) => {
    const [posts, setPosts] = useState<Array<any>>(init)
    const [wait, setWait] = useState<boolean>(false)
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
            const posts: Array<any> = await req<any>(`/post?page=${id}`)
            setPosts((ps)=> ps.concat(posts.filter((p)=> !!getSampleUrl(p))))
            setWait(true)
        }}
        initialLoad={false}
    >
        <div style={{
            padding: 16
        }}>
            <Selector />
        </div>
        <WarpTop />
        <ImageLines posts={posts} line_length={3} />
    </InfiniteScroll>
}
export {
    BooruImageInfinite as default
}