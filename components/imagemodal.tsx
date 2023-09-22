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
            <BooruImageFromPost style={{
                maxWidth: "80%",
                height: "calc(100% - 32px)",
                width: "auto",
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