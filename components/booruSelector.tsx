import {
    BooruImageList,
    BooruImageListOption,
    defaultBooruImageList, Fn,
    UpdateBooruSettingsFn
} from "@/hook/useBooruImageList";
import React, {ComponentProps, forwardRef, useEffect, useRef, useState} from "react";
import {req} from "@/lib/fetch";
import {quickSort} from "@/lib/sort";
import {mergeObjectForce} from "@/lib/utils/object";
import {Account} from "@/hook/useAccount";

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

export const Button = forwardRef(function Button ({ children, active, onClick, style, ...other }:{
    children: any,
    active?: boolean,
    onClick?: (e: any) => void,
    style?: React.CSSProperties,
} & ComponentProps<"div">, ref: any) {
    return <div {...other} ref={ref} onClick={(e)=> onClick && onClick(e)} style={mergeObjectForce({
        padding: "16px 32px",
        border: "1px solid #eee",
        width: "fit-content",
        borderRadius: 100,
        backgroundColor: active ? "#f5f5f5" : "#fff",
        cursor: "pointer",
        whiteSpace: "nowrap"
    }, style)}>
        <p style={{
            margin: 0,
            width: "fit-content",
            lineHeight: 1,
            pointerEvents: "none"
        }}>{ children }</p>
    </div>
})

type ButtonSelectorBaseProps<T> = {
    items: Array<{
        label: string,
        value: T
    } | T>,
    onChange?: (value: T) => void,
    value?: T
}


const toValue = <T = any>(item: { label: string, value: T } | T): {label: string | T, value: T} => {
    if(item instanceof  Object) {
        return item
    }
    return ({label: item, value: item}) as any
}

export const ButtonMultipleSelector = <T = any>({items, onChange, value}: {
    items: Array<{
        label: string,
        value: T
    } | T>,
    value: Array<T>,
    onChange: (value: Array<T>) => void
}) => {
    return <ButtonContainer>
        {items.map((v, i)=> <Button
            key={i}
            /*style={{
                backgroundColor: value.includes(toValue(v).value) ? "#f5f5f5" :  "transparent",
                transition: "all .3s ease"
            }}*/
            active={value.includes(toValue(v).value)}
            onClick={()=> {
                if(!onChange) return
                const val = toValue(v).value
                if(value.includes(val)) {
                    return onChange(value.filter((v)=> v != val))
                }
                return onChange(value.concat(val))
            }}
        >{toValue(v).label}</Button>)}
    </ButtonContainer>
}

export const ButtonSelector = <T = any>({items, onChange, value}: ButtonSelectorBaseProps<T>) => {
    const firstButtonRef = useRef(null)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [left, setLeft] = useState(0)
    const updateState = (e: any) => {
        setWidth(e.offsetWidth)
        setHeight(e.offsetHeight)
        setLeft(e.offsetLeft)
    }
    const defaultValueNum = items.reduce((acc, v, i)=> acc || ( toValue(v).value == value ? i : 0 ) , 0 )
    useEffect(()=> {
        updateState(firstButtonRef.current)
    },[])
    return <ButtonContainer style={{
        position: "relative"
    }}>
        {items.map((v, i)=> <Button
            key={i}
            style={{
                border: "none",
                backgroundColor: toValue(v).value == value ? "#f5f5f5" :  "transparent",
                transition: "all .3s ease"
            }}
            ref={i==defaultValueNum? firstButtonRef : undefined}
            onMouseEnter={(e)=> updateState(e.target)}
            onClick={()=> onChange && onChange(toValue(v).value)}
        >{toValue(v).label}</Button>)}
        <div style={{
            position: "absolute",
            width: width - 2,
            height,
            transform: `translateX(${left - 8}px) translateY(-1px)`,
            borderRadius: 100,
            border: "1px solid #eee",
            transition: "all .3s ease",
            pointerEvents: "none"
        }} />
    </ButtonContainer>
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

export const SelectorItemContainer = ({children, flex, style}:{
    children: React.ReactNode | Array<React.ReactNode>,
    flex?: boolean,
    style?: React.CSSProperties
}) => {
    return <div style={mergeObjectForce({
        gap: 12,
        display: "flex",
        flexDirection: flex ? "row" : "column",
        maxWidth: "100vw",
        flexWrap: "wrap"
    }, style)}>
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

const createSelectorState = <K extends keyof BooruImageList>(onChange: ((option: BooruImageListOption)=> void) | undefined, value: BooruImageList | null, updateValue: UpdateBooruSettingsFn, key: K): [BooruImageList[K], (value: BooruImageList[K] | Fn<BooruImageList[K]>)=> void] => {
    const v = value || defaultBooruImageList
    const u = updateValue as any
    return [v[key], (value: BooruImageList[K] | Fn<BooruImageList[K]>)=> {
        return u((s: BooruImageList)=> {
            const v = {
                [`${key}`]: value instanceof Function ? value(s[key]) : value
            }
            onChange && onChange(mergeObjectForce(s, v))
            return v
        })
    }]
};

export const Selector = ({init, onChange, value, updateValue, account, setAccount}:{
    init: init,
    onChange?: (option: BooruImageListOption) => void,
    value: BooruImageList | null,
    updateValue: UpdateBooruSettingsFn,
    account: Account | null,
    setAccount: (account: Account) => void
}) => {
    const [suggest, setSuggest] = useState<suggest>([])
    const [showMore, setShowMore] = useState(false)
    const [like, setLike] = createSelectorState(onChange, value, updateValue, "like")
    const [query, setQuery] = createSelectorState(()=> {}, value, updateValue, "query")
    const [tagString, setTagString] = createSelectorState(onChange, value, updateValue, "tags")
    const [tag, setTagHandler] = createSelectorState(undefined, value, updateValue, "tagsRaw")
    const setTag: typeof setTagHandler = (args) => {
        setTagHandler(args)
        setTagHandler((tag)=> {
            const tags = tag || []
            setTagString(tags.map((tag)=> tag.name).join(" "))
            return tag
        })
    }
    const [booru, setBooru] = createSelectorState(onChange, value, updateValue, "booru")
    const [bypassCache, setBypassCache] = createSelectorState(onChange, value, updateValue, "bypassCache")
    // rating:general とかをtagに追加すればいける
    const [maxSensitiveLevel, setMaxSensitiveLevel] = createSelectorState(onChange, value, updateValue, "maxSensitiveLevel")
    const [showSensitiveLevel, setShowSensitiveLevel] = createSelectorState(onChange, value, updateValue, "showSensitiveLevel")
    const [sensitiveFilterType, setSensitiveFilterType] = createSelectorState(onChange, value, updateValue, "sensitiveFilterType")
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
            <ButtonContainer>
                <ButtonInput value={account?.id || ""} onChange={(e)=> {
                    setAccount({id: e.target.value})
                }}/>
                <Button onClick={()=> {
                    setLike((l)=> !l)
                }} active={like}>Liked</Button>
            </ButtonContainer>
        </SelectorItemContainer>
        <SelectorItemContainer flex>
            <ButtonContainer>
                <Button onClick={()=> {
                    setBypassCache((v)=> !v)
                }} active={bypassCache}>BypassCache</Button>
            </ButtonContainer>
            {/*<ButtonContainer>
                <Button>Hide</Button>
                <Button>Blur</Button>
            </ButtonContainer>*/}
            <ButtonSelector value={sensitiveFilterType} onChange={(e: any)=> setSensitiveFilterType(e)} items={[
                { label: "Hide", value: "hide"},
                { label: "Blur", value: "blur"}
            ]}/>
            {/*<ButtonContainer>
                <Button>General</Button>
                <Button>Sensitive</Button>
                <Button>Questionable</Button>
                <Button>Explicit</Button>
            </ButtonContainer>*/}
            <ButtonMultipleSelector value={showSensitiveLevel} onChange={(e)=> setShowSensitiveLevel(quickSort(e))} items={[
                {label: "General", value: 0},
                { label: "Sensitive", value: 1},
                { label: "Questionable", value: 2},
                { label: "Explicit", value: 3}
            ]} />
        </SelectorItemContainer>
    </SelectorItemContainer>
}