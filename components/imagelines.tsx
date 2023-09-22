"use client"
import { useEffect, useState } from "react"
import BooruImage, { BooruImageFromPost } from "./booruImage"
import useWindowSize from "@/hook/useWindowSize"
import Link from "next/link"

const getAspect = (width: number, height: number) => height / width
const getSize = (post: any): [number, number] => {
    if( post.width )
        return [post.width, post.height]
    return [post.image_width, post.image_height]
}
const getMin = (array: Array<Array<any>>): number => {
    return array.reduce(([min, arr_i], v, i) => {
        const sum = v.reduce((acc, v, i, arr) => acc + getAspect(...getSize(v)), 0)
        return sum < min ? [sum, i] : [min, arr_i]
    }, [Infinity, -1])[1]
}
const createLines = (posts: Array<any>, line_length: number) => {
    const arr: Array<Array<any>> = new Array(line_length).fill(0).map(()=> [])
    posts.map((p)=> arr[getMin(arr)].push(p))
    return arr
}

const ImageLines = ({posts, line_length}:{
    posts: Array<any>,
    line_length: number
}) => {
    const [lines, setLines] = useState<Array<Array<any>>>(new Array(line_length).fill(0).map(()=> []))
    const [width, height] = useWindowSize()
    useEffect(()=> {
        setLines(()=> createLines(posts, Math.round(width / 500) || 3))
    }, [posts, line_length, width])
    return <div style={{ display: "flex" }}>
        {lines.map((arr, i) => (
            <div key={i} style={{ width: `calc(100% / ${Math.round(width / 500) || 3})`, marginBottom: '25px' }}>
                {arr.map((p: any) => (
                    <div key={p.file_url} style={{ width: "calc(100% - 10px)", marginRight: "5px", marginLeft: "5px", marginBottom: "10px" }}>
                        <Link scroll={false} href={`/i/${p.id}`}>
                            <BooruImageFromPost style={{
                                width: "calc(100% - 10px)",
                                aspectRatio: `${getSize(p)[0]} / ${getSize(p)[1]}`,
                                backgroundColor: "#eee",
                                borderRadius: 40
                            }} post={p} />
                        </Link>
                    </div>
                ))}
            </div>
        ))}
    </div>
}
export default ImageLines