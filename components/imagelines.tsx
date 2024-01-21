"use client"
import { useEffect, useState } from "react"
import BooruImage, { BooruImageFromPost } from "./booruImage"
import useWindowSize from "@/hook/useWindowSize"
import Link from "next/link"
import {ImagelinesImage} from "@/components/imagelinesimage";
import {Account} from "@/hook/useAccount";

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

const ImageLines = ({posts, line_length, booru, isReverse = false, showSensitiveLevel, account}:{
    posts: Array<any>,
    line_length: number,
    booru: string,
    isReverse?: boolean,
    showSensitiveLevel?: Array<number>,
    account: Account | null
}) => {
    const [lines, setLines] = useState<Array<Array<any>>>(new Array(line_length).fill(0).map(()=> []))
    const [width, height] = useWindowSize()
    useEffect(()=> {
        setLines(()=> createLines(posts, Math.round(width / 500) || 3))
    }, [posts, line_length, width])
    return <div style={{ display: "flex" }}>
        {lines.map((arr, i) => (
            <div key={i} style={{ width: `calc(100% / ${Math.round(width / 500) || 3})`, marginBottom: '25px', display: "flex", flexDirection: isReverse ? "column-reverse" : "column" }}>
                {arr.map((p: any) => (
                    <div key={p.file_url} style={{ width: "calc(100% - 10px)", marginRight: "5px", marginLeft: "5px", marginBottom: "10px" }}>
                        <ImagelinesImage account={account} showSensitiveLevel={showSensitiveLevel} post={p} booru={booru} />
                    </div>
                ))}
            </div>
        ))}
    </div>
}
export default ImageLines