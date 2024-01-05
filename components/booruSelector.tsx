import {
    BooruImageList,
    BooruImageListOption,
    defaultBooruImageList, Fn,
    UpdateBooruSettingsFn
} from "@/hook/useBooruImageList";
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

export const SelectorItemContainer = ({children, flex}:{
    children: React.ReactNode | Array<React.ReactNode>,
    flex?: boolean
}) => {
    return <div style={{
        gap: 12,
        display: "flex",
        flexDirection: flex ? "row" : "column",
        maxWidth: "100vw"
    }}>
        {children}
    </div>
}

export const ButtonInput = ({value, onChange}:{
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
    return <input value={value} onChange={onChange} style={{
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
}

const toggleTag = (tags: Array<any> | null, tag: any) => {
    if(removeTag(tags, tag).length != tags?.length) {
        return removeTag(tags, tag)
    }
    return appendTag(tags, tag)
}

const appendTag = (tags: Array<any> | null, tag: any) => {
    return [tag].concat(removeTag(tags, tag))
}
const removeTag = (tags: Array<any> | null, tag: any) => {
    return tags?.filter((v)=> v.name != tag.name) || []
}

export const Selector = ({init, onChange, value, updateValue}:{
    init: init,
    onChange?: (option: BooruImageListOption) => void,
    value: BooruImageList | null,
    updateValue: UpdateBooruSettingsFn
}) => {
    //const [like, setLike] = useState(value?.like)
    //const [query, setQuery] = useState(value?.query || "")
    const [suggest, setSuggest] = useState<suggest>([])
    //const [tag, setTag] = useState<null | Array<tag>>(value?.tagsRaw || null)
    //const [booru, setBooru] = useState(value?.booru)
    //const [bypassCache, setBypassCache] = useState(value?.bypassCache)
    const [showMore, setShowMore] = useState(false)
    /*useEffect(() => {
        setLike(value?.like)
        setBooru(value?.booru)
        setBypassCache(value?.bypassCache)
        setTag(value?.tagsRaw || null)
        setQuery(value?.query || "")
    }, [value]);*/

    const createSelectorState = <K extends keyof BooruImageList>(key: K): [BooruImageList[K], (value: BooruImageList[K] | Fn<BooruImageList[K]>)=> void] => {
        const v = value || defaultBooruImageList
        const u = updateValue as any
        return [v[key], (value: BooruImageList[K] | Fn<BooruImageList[K]>)=> {
            if(value instanceof  Function) {
                return u((s: BooruImageList)=> {
                    const v = {[`${key}`]: value(s[key])}
                    onChange && onChange(mergeObjectForce(s, v))
                    return v
                })
            }
            return u((s: BooruImageList)=> {
                const v = {[`${key}`]: value}
                onChange && onChange(mergeObjectForce(s, v))
                return v
            })
        }]
    };
    const [like, setLike] = createSelectorState("like")
    const [query, setQuery] = createSelectorState("query")
    const [tag, setTag] = createSelectorState("tagsRaw")
    const [booru, setBooru] = createSelectorState("booru")
    const [bypassCache, setBypassCache] = createSelectorState("bypassCache")
    /*useEffect(() => {
        if(value == null) return
        onChange && onChange({
            tags: tag ? tag.map((v)=> v.name).join(" ") : "",
            booru,
            like,
            bypassCache,
            tagsRaw: tag,
            query,
        })
    }, [tag, booru, like, bypassCache])*/
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
    return <SelectorItemContainer>
        <ButtonContainer>
            {boorus.map((b, i) => <Button onClick={()=> {
                setBooru(b.id)
            }} key={i} active={booru==""?!i:booru==b.id}>{b.name}</Button>)}
        </ButtonContainer>
        <ButtonContainer>
            <ButtonInput value={query} onChange={(e)=> {
                setQuery(e.target.value)
            }}/>
            {quickSort(suggest, (a, b)=> Number.parseInt(a.post_count) > Number.parseInt((b.post_count))).slice(0, 3).map((b: any, i: any) => <Button onClick={()=> {
                setTag((tag)=> toggleTag(tag, b))
            }} key={i} active={tag?.map((v)=> v.name).includes(b.name)}><span style={{color: color[b.category]}}>{b.name}</span> {b.post_count}</Button>)}
            {query && <Button onClick={()=> {
                setTag((tag)=> toggleTag(tag, {
                    name: query,
                    category: "5",
                    post_count: "0"
                }))
            }} active={tag?.map((v)=> v.name).includes(query)}>{query}</Button>}
        </ButtonContainer>
        {(tag && !!tag.length) && <ButtonContainer>
            {tag?.map((b, i) => <Button onClick={()=> {
                setTag((tag)=> removeTag(tag, b))
            }} key={i} active={true}><span style={{color: color[b.category]}}>{b.name}</span></Button>)}
        </ButtonContainer>}
        <SelectorItemContainer flex>
            <ButtonContainer style={{
                flexWrap: showMore ? "wrap" : "nowrap",
                transition: "all .3s ease"
            }}>
                {tags.slice(0, showMore ? 30 : 4).map((b: any, i: any) => <Button onClick={()=> {
                    setTag((tag)=> toggleTag(tag, {
                        name: b.name,
                        category: "5",
                        post_count: "0"
                    }))
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
        </SelectorItemContainer>
        <ButtonContainer style={{
            transition: "all .3s ease"
        }}>
            <Button onClick={()=> {
                setBypassCache((v)=> !v)
            }} active={bypassCache}>BypassCache</Button>
        </ButtonContainer>
    </SelectorItemContainer>
}