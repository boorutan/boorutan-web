import {BooruImageList, BooruImageListOption} from "@/hook/useBooruImageList";
import React, {useEffect, useState} from "react";
import {req} from "@/lib/fetch";
import {quickSort} from "@/lib/sort";
import {mergeObjectForce} from "@/lib/utils/object";

type init = {
    tags: any,
    posts: any
}

type suggest = {
    category: string,
    created_at: string,
    is_locked: boolean,
    name: string,
    post_count: string,
    updated_at: string
}[]

type tag = {
    category: string,
    name: string,
    post_count: string
}


const color: any = {
    "0": "#2196F3", // general
    "1": "#E91E63", // artist
    "2": "#FFEB3B", // invalid
    "3": "#9C27B0", // copyright
    "4": "#4CAF50", // character
    "5": "#FFEB3B", // meta
}

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

const tags = [
    { name: "loli" },
    { name: "hololive" },
    { name: "cirno" }
]

export const Button = ({ children, active, onClick }:{
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

export const ButtonContainer = ({children, style}:{
    children: React.ReactNode | Array<React.ReactNode>,
    style?: React.CSSProperties
}) => {
    return <div style={mergeObjectForce({
        display: "flex",
        gap: 12,
        padding: 8,
        border: "1px solid #eee ",
        width: "fit-content",
        borderRadius: 100,
        overflowX: "auto",
        maxWidth: "calc(100vw - 32px - 16px)"
    }, style)}>{children}</div>
}

export const Selector = ({init, onChange, value}:{
    init: init,
    onChange?: (option: BooruImageListOption) => void,
    value: BooruImageList | null
}) => {
    const [like, setLike] = useState(value?.like)
    const [query, setQuery] = useState(value?.query || "")
    const [suggest, setSuggest] = useState<suggest>([])
    const [tag, setTag] = useState<null | Array<tag>>(value?.tagsRaw || null)
    const [booru, setBooru] = useState(value?.booru)
    const [bypassCache, setBypassCache] = useState(value?.bypassCache)
    const [showMore, setShowMore] = useState(false)
    useEffect(() => {
        setLike(value?.like)
        setBooru(value?.booru)
        setBypassCache(value?.bypassCache)
        setTag(value?.tagsRaw || null)
        setQuery(value?.query || "")
    }, [value]);
    useEffect(() => {
        if(value == null) return
        onChange && onChange({
            tags: tag ? tag.map((v)=> v.name).join(" ") : "",
            booru,
            like,
            bypassCache,
            tagsRaw: tag,
            query,
        })
    }, [tag, booru, like, bypassCache]);
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const res: suggest = await req(`/tag/suggest?q=${query}`)
            if(!Array.isArray(res))
                return
            const sorted = quickSort(res, (a, b)=> Number(a.post_count) > Number(b.post_count))
            setSuggest(sorted)
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    }, [query])
    return <div style={{
        gap: 12,
        display: "flex",
        flexDirection: "column",
        maxWidth: "100vw"
    }}>
        <ButtonContainer>
            {boorus.map((b, i) => <Button onClick={()=> {
                setBooru(b.id)
            }} key={i} active={booru==""?!i:booru==b.id}>{b.name}</Button>)}
        </ButtonContainer>
        <ButtonContainer>
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
            {quickSort(suggest, (a, b)=> Number.parseInt(a.post_count) > Number.parseInt((b.post_count))).slice(0, 3).map((b: any, i: any) => <Button onClick={()=> {
                setTag((tag)=> {
                    if(!tag) return [b]
                    if(tag.map((v)=> v.name).includes(b.name)) {
                        return tag.filter((v)=> v.name != b.name)
                    }
                    return [b].concat(tag)
                })
            }} key={i} active={tag?.map((v)=> v.name).includes(b.name)}><span style={{color: color[b.category]}}>{b.name}</span> {b.post_count}</Button>)}
            {query && <Button onClick={()=> {
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
            }} active={tag?.map((v)=> v.name).includes(query)}>{query}</Button>}
        </ButtonContainer>
        {(tag && !!tag.length) && <ButtonContainer>
            {tag?.map((b, i) => <Button onClick={()=> {
                setTag((tag)=> {
                    if(!tag) return null
                    return tag.filter((v)=> v.name != b.name)
                })
            }} key={i} active={true}><span style={{color: color[b.category]}}>{b.name}</span></Button>)}
        </ButtonContainer>}
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12
        }}>
            <ButtonContainer style={{
                flexWrap: showMore ? "wrap" : "nowrap",
                transition: "all .3s ease"
            }}>
                {tags.slice(0, showMore ? 30 : 4).map((b: any, i: any) => <Button onClick={()=> {
                    setTag((tag)=> {
                        const t = {
                            name: b.name,
                            category: "5",
                            post_count: "0"
                        }
                        if(!tag) return [t]
                        if(tag.map((v)=> v.name).includes(t.name)) {
                            return tag.filter((v)=> v.name != t.name)
                        }
                        return [t].concat(tag)
                    })
                }} key={i} active={tag?.map((v)=> v.name).includes(query)}>{b.name}</Button>)}
                {!showMore && <Button onClick={()=> {
                    setShowMore((s)=> !s)
                }} active>Show more</Button>}
            </ButtonContainer>
            <ButtonContainer style={{
                transition: "all .3s ease"
            }}>
                <Button onClick={()=> {
                    setLike((l)=> !l)
                }} active={like}>Liked</Button>
            </ButtonContainer>
        </div>
        <ButtonContainer style={{
            transition: "all .3s ease"
        }}>
            <Button onClick={()=> {
                setBypassCache((v)=> !v)
            }} active={bypassCache}>BypassCache</Button>
        </ButtonContainer>
    </div>
}