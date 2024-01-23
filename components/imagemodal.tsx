"use client"
import {useRouter, useSearchParams} from "next/navigation"
import {useCallback, useState} from "react"
import BooruImage, {BooruImageFromPost} from "@/components/booruImage";
import {getDescription, getOriginalUrl, getTitle} from "@/lib/booru";
import {req} from "@/lib/fetch";
import {useBooruImageList} from "@/hook/useBooruImageList";
import {useEffectApi} from "@/hook/useApi";

const SelectorButton = ({ children, active, onClick, color }:{
    children: any,
    active?: boolean,
    onClick?: (e: any) => void,
    color?: string
}) => {
    return <div onClick={(e)=> onClick && onClick(e)} style={{
        padding: "16px 32px",
        border: "1px solid #eee",
        width: "fit-content",
        borderRadius: 100,
        backgroundColor: color ? color : active ? "#f5f5f5" : "#fff",
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

/*const color: any = {
    "0": "#E1F5FE", // general
    "1": "#FCE4EC", // artist
    "2": "#ECEFF1", // invalid
    "3": "#EDE7F6", // copyright
    "4": "#E8F5E9", // character
    "5": "#FFF", // meta
}*/

const color: any = {
    "0": "#2196F3", // general
    "1": "#E91E63", // artist
    "2": "#FFEB3B", // invalid
    "3": "#9C27B0", // copyright
    "4": "#4CAF50", // character
    "5": "#FFEB3B", // meta
}

const translateTag = async (tags: Array<string>): Promise<Array<string>> => {
    return (await req<Array<string>>("/tag/translate", {
        method: "POST",
        body: {
            tags
        }
    }))
}

const ImageModal = ({post, category, notModal, booru}:{
    post: any,
    category: any,
    booru: string,
    notModal?: boolean,
}) => {
    const [settings, setSettings] = useBooruImageList(()=>{}, {
        replaceId: false
    })
    const [translate, setTranslate] = useState<{[key: string]: string}>({})
    const [liked, setLiked] = useState(false)
    const router = useRouter()
    const query = useSearchParams()
    const back = useCallback(() => {
        !notModal && router.back()
    }, [notModal, router])
    useEffectApi(async ()=> {
        const tags = await translateTag(Object.keys(category))
        console.log(tags)
        const obj = Object.keys(category).reduce((acc: any, v, i)=> {
            acc[v] = tags[i]
            return acc
        },{})
        console.log(obj)
        setTranslate(obj)
    },[])
    return <div id={"modal"} onClick={(e: any)=> {
        if(e.target.nodeName == "DIV") {
            back()
        }
    }} style={{
        position: "fixed",
        top: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto"
    }}>
        <div style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
        }}>
            <div style={{
                width: "100%",
                //height: "calc(100% - 32px)",
                position: "absolute",
                zIndex: 3,
                top: 16
            }}>
                <div style={{
                    display: "flex",
                    gap: 12,
                    padding: 8,
                    width: "fit-content",
                    borderRadius: 100,
                    flexWrap: "wrap",
                }}>
                    {Object.keys(category).map((c, i) => <p onClick={()=> {
                        console.log(category)
                        const tag = {
                            name: c,
                            category: category[c],
                            post_count: "0"
                        }
                        function replaceXwithY(str: string, X: string, Y: string) {
                            let regex = new RegExp(`(^|\\s)${X}(\\s|$)`, 'g');
                            return str.replace(regex, Y);
                        }
                        setSettings((s)=> ({
                            tags: `${c} `.concat(replaceXwithY(s.tags, c, "")).trim(),
                            tagsRaw: [tag].concat((s.tagsRaw || []).filter((t)=> t.name != c)),
                            posts: [],
                            page: 2,
                            pageBack: 0,
                            postsBack: []
                        }))
                        router.push(`/?id=${query.get("id")}`)
                        const interval = setInterval(()=> {
                            location.reload()
                            clearInterval(interval)
                        }, 100)
                        //router.push(`/?id=${query.get("id")}`)
                        //router.replace(`/?id=${query.get("id")}`)

                    }} style={{color: color[category[c]], margin: 0, cursor: "pointer"}} key={i}>{translate[c] || c}</p>)}
                </div>
            </div>
            <BooruImageFromPost  mock style={{
                maxWidth: "calc(100% - 4px)",
                maxHeight: "calc(100% - 4px)",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                pointerEvents: "all",
                cursor: "pointer"
                //boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"
            }} original post={post} />
            <div style={{
                position: "absolute",
                bottom: 16,
                left: 32,
                zIndex: 3
            }}>
                <p style={{
                    color: "#000",
                    cursor: "pointer"
                }}>{getTitle(post, category)}</p>
                <p style={{
                    color: "#000",
                    cursor: "pointer"
                }}>{getDescription(post, category)}</p>
            </div>
            {/*<div style={{
                position: "absolute",
                bottom: 16,
                right: 32,
                cursor: "pointer"
            }}>
                <p onClick={async ()=> {
                    const res = await req(`/like/${booru}/${post.id}`, {
                        method: "POST",
                        body: {
                            like: true
                        }
                    })
                    setLiked(true)
                }}>Like</p>
            </div>*/}
        </div>
    </div>
}
export default ImageModal