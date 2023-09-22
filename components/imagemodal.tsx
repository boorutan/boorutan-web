"use client"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import BooruImage, {BooruImageFromPost} from "@/components/booruImage";
import {getOriginalUrl} from "@/lib/booru";

const ImageModal = ({post}:{
    post: any
}) => {
    const router = useRouter()
    const back = useCallback(() => {
        router.back()
    }, [router])
    console.log(post);
    return <div id={"modal"} onClick={back} style={{
        position: "fixed",
        top: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <BooruImageFromPost style={{
                maxWidth: "80%",
                height: "100%",
                width: "auto"
            }} original post={post} />
        </div>
    </div>
}
export default ImageModal