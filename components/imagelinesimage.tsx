"use client"
import {BooruImageFromPost} from "@/components/booruImage";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {useRerender} from "@/hook/useRerender";
import {req} from "@/lib/fetch";
import {isNeedBlur} from "@/lib/booru";
import {useBooruImageList} from "@/hook/useBooruImageList";
import {Account} from "@/hook/useAccount";

const getSize = (post: any): [number, number] => {
    if( post.width )
        return [post.width, post.height]
    return [post.image_width, post.image_height]
}

export const ImagelinesImage = ({post, booru, showSensitiveLevel, account}:{
    post: any,
    booru: string,
    showSensitiveLevel?: Array<number>,
    account: Account | null
}) => {
    const update = useRerender()
    const router = useRouter()
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [isMouseHover, setIsMouseHover] = useState(false)
    const [progress, setProgress] = useState(0)
    const [[mouseX, mouseY], setMousePosition] = useState<[number, number]>([0, 0])
    const [like, setLike] = useState(true)
    const query = useSearchParams()
    const pointerSize = progress >= 100 ? 1600 : progress * 10
    useEffect(() => {
        const refresh = setTimeout(()=> {
            const speed = 5
            if(isMouseDown) {
                setProgress((p)=> p >= 100 ? 100 : p + speed)
            } else {
                setProgress((p)=> p <= 0 ? 0 : p - speed * 2)
            }
            update()
        }, 10)
        return ()=> clearInterval(refresh)
    }, [update]);

    return <div
        onMouseDown={()=> setIsMouseDown(true)}
        onMouseUp={()=> setIsMouseDown(false)}
        onMouseEnter={()=> setIsMouseHover(true)}
        onMouseLeave={()=> {
            setIsMouseHover(false)
            setIsMouseDown(false)
        }}
        onMouseMove={(e: any)=> {
            setMousePosition([e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop])
        }}
        style={{
            cursor: "pointer",
            width: "calc(100% - 10px)",
            aspectRatio: `${getSize(post)[0]} / ${getSize(post)[1]}`,
            overflow: "hidden",
            position: "relative",
            borderRadius: 40,
        }}
        onClick={async ()=> {
            if(progress >= 100) {
                const res = await req(`/account/like/${post.booru_type || booru}/${post.id}`, {
                    method: "POST",
                    body: {
                        like,
                    },
                    header: {
                        Account: account?.id || "anonymous"
                    }
                })
                setLike((v)=> !v)
                return
            }
            router.push(`/${post.booru_type || booru}/${post.id}?id=${query.get("id")}`)
        }}
    >
        <BooruImageFromPost style={{
            width: "100%",
            aspectRatio: `${getSize(post)[0]} / ${getSize(post)[1]}`,
            backgroundColor: "#eee",
            borderRadius: 40,
            pointerEvents: "none",
            //filter: "blur(3px)"
            //outline: `${progress / 10}px solid #FCE4EC`
        }} post={post} />
        {isNeedBlur(showSensitiveLevel || [], post) && <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backdropFilter: `blur(30px)`,
            //borderRadius: "100%",
            pointerEvents: "none",
            top: 0,
            left: 0
        }} />}
        {isMouseHover && <div style={{
            position: "absolute",
            width: pointerSize,
            height: pointerSize,
            backdropFilter: `blur(10px) grayscale(${like ? "0" : ".8"})`,
            top: mouseY + window.scrollY - pointerSize / 2,
            left: mouseX - pointerSize / 2,
            zIndex: 100,
            borderRadius: "100%",
            transition: "all .1s ease, backdrop-filter 1s ease",
            pointerEvents: "none"
        }} />}
    </div>


    return <Link scroll={false} href={`/${post.booru_type || booru}/${post.id}`}>
        <BooruImageFromPost style={{
            width: "calc(100% - 10px)",
            aspectRatio: `${getSize(post)[0]} / ${getSize(post)[1]}`,
            backgroundColor: "#eee",
            borderRadius: 40
        }} post={post} />
    </Link>
}