"use client"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import BooruImage, {BooruImageFromPost} from "@/components/booruImage";
import {getOriginalUrl} from "@/lib/booru";

const getCategoryData = (post: any, category: any, type: string, none: string) => {
    const character = Object.keys(category).filter((v: any)=> category[v] == type)
    if(character.length)
        return character.reduce((acc: string, v: any, i: number)=> {
            return i ? `${acc},${v}` : v
        }, "")
    return none
}

const getTitle = (post: any, category: any) => {
    return getCategoryData(post, category, "4", "Original")
}

const getDescription = (post: any, category: any) => {
    return getCategoryData(post, category, "3", "Original")
}

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

const color: any = {
    "0": "#E1F5FE", // general
    "1": "#FCE4EC", // artist
    "2": "#ECEFF1", // invalid
    "3": "#EDE7F6", // copyright
    "4": "#E8F5E9", // character
    "5": "#FFF", // meta
}

const ImageModal = ({post, category}:{
    post: any,
    category: any,
}) => {
    const router = useRouter()
    const back = useCallback(() => {
        router.back()
    }, [router])
    console.log(post, category);
    return <div id={"modal"} onClick={back} style={{
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
            {/*<div style={{
                width: "100%",
                height: "calc(100% - 32px)",
            }}>
                <div style={{
                    display: "flex",
                    gap: 12,
                    padding: 8,
                    width: "fit-content",
                    borderRadius: 100,
                    flexWrap: "wrap",
                }}>
                    {Object.keys(category).map((c, [booru]) => <SelectorButton color={color[category[c]]} key={[booru]}>{c}</SelectorButton>)}
                </div>
            </div>*/}
            <BooruImageFromPost style={{
                maxWidth: "calc(100% - 4px)",
                maxHeight: "calc(100% - 4px)",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                //boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"
            }} original post={post} />
            <div style={{
                position: "absolute",
                bottom: 16,
                left: 32,
            }}>
                <p style={{
                    color: "#000"
                }}>{getTitle(post, category)}</p>
                <p style={{
                    color: "#000"
                }}>{getDescription(post, category)}</p>
            </div>
        </div>
    </div>
}
export default ImageModal