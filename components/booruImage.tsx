"use client"
import {getExtension, getOriginalUrl, getSampleUrl} from "@/lib/booru"
import { useState } from "react"
import baseurl from "@/lib/url";
import {SimpleImageMock} from "@/components/imagemock";

const isVideo = (extension: string) => ["mp4"].includes(extension)
const isImage = (extension: string) => ["jpg", "jpeg", "png"].includes(extension)

const BooruImage = ({ src, style, post, mock = false }: {
    src: string,
    style?: React.CSSProperties,
    post: any,
    mock?: boolean
}) => {
    const [show, setShow] = useState(true)
    return <>
        {!mock && show && isImage(getExtension(src)) && <img onError={() => {
            setShow(false)
        }} style={Object.assign({
            objectFit: "cover",
        }, style)} src={`${baseurl}/image?url=${src}`} alt={""} />}
        {mock && show && isImage(getExtension(src)) && <SimpleImageMock style={style} src={`${baseurl}/image?url=${src}`} pixels={post.summary} />}
        {show && isVideo(getExtension(src)) && <video muted loop autoPlay onError={() => {
            setShow(false)
        }} style={Object.assign({
            objectFit: "cover",
        }, style)} src={`${baseurl}/image?url=${src}`} />}
        {!show && <div style={style} />}
    </>
}

const BooruImageLoad = ({ src, style }: {
    src: string,
    style?: React.CSSProperties
}) => {
    const [show, setShow] = useState(true)
    const [load, setLoad] = useState(false)
    return <div style={{
        position: "relative"
    }}>
        {show && isImage(getExtension(src)) && <img onLoad={()=> {
            setLoad(true)
        }} onError={() => {
            setShow(false)
        }} style={Object.assign({
            objectFit: "cover",
        }, style)} src={`${baseurl}/image?url=${src}`} alt={""} />}
        {show && isVideo(getExtension(src)) && <video muted loop autoPlay  onLoad={()=> {
            setLoad(true)
        }} onError={() => {
            setShow(false)
        }} style={Object.assign({
            objectFit: "cover",
        }, style)} src={`${baseurl}/image?url=${src}`} />}
        <div style={Object.assign({
            position: "absolute",
            top: 0,
            zIndex: 0,
            opacity: (!load || !show) ? 1: 0
        }, style)} />
    </div>
}

const BooruImageFromPost = ({ post, style, original, load, mock = false }: {
    post: any,
    original?: boolean,
    load?: boolean,
    style?: React.CSSProperties,
    mock?: boolean
}) => {
    return load ?
        <BooruImageLoad style={style} src={!original ? getSampleUrl(post) : getOriginalUrl(post)}  /> :
        <BooruImage mock={mock}     style={style} src={!original ? getSampleUrl(post) : getOriginalUrl(post)} post={post}  />
}
export {
    BooruImage as default,
    BooruImageFromPost
}