"use client"
import { getExtension, getSampleUrl } from "@/lib/booru"
import { useState } from "react"

const isVideo = (extension: string) => ["mp4"].includes(extension)
const isImage = (extension: string) => ["jpg", "jpeg", "png"].includes(extension)

const BooruImage = ({ src, style }: {
    src: string,
    style?: React.CSSProperties
}) => {
    const [show, setShow] = useState(true)
    return <>
        {show && isImage(getExtension(src)) && <img onError={() => {
            setShow(false)
        }} style={Object.assign({
            objectFit: "cover",
        }, style)} src={`http://127.0.0.1:8080/image?url=${src}`} alt={""} />}
        {show && isVideo(getExtension(src)) && <video muted loop autoPlay onError={() => {
            setShow(false)
        }} style={Object.assign({
            objectFit: "cover",
        }, style)} src={`http://127.0.0.1:8080/image?url=${src}`} />}
        {!show && <div style={style} />}
    </>
}

const BooruImageFromPost = ({ post, style }: {
    post: any,
    style?: React.CSSProperties
}) => {
    return <BooruImage style={style} src={getSampleUrl(post)}  />
}
export {
    BooruImage as default,
    BooruImageFromPost
}