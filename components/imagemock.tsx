import {CSSProperties, useEffect, useLayoutEffect, useRef, useState} from "react";
import {mergeObject, mergeObjectForce} from "@/lib/utils/object";
import {useRerender} from "@/hook/useRerender";

type Pixel = {
    R: Number,
    G: Number,
    B: Number
}

export const SimpleImageMock = ({details = 10, src, pixels, style}: {
    details?: number,
    src: string,
    pixels: Pixel[],
    style?: React.CSSProperties
}) => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const update = useRerender()
    const ref = useRef<any>(null)
    useLayoutEffect(() => {
        setWidth(ref.current?.clientWidth || 0)
        setHeight(ref.current?.clientHeight || 0)
    }, []);
    useEffect(() => {
        const refresh = setTimeout(()=> {
            setWidth(ref.current?.clientWidth || 0)
            setHeight(ref.current?.clientHeight || 0)
            update()
        }, 100)
        return ()=> clearInterval(refresh)
    }, [update]);
    return <>
        <img ref={ref} src={src} style={mergeObjectForce({
            objectFit: "cover",
            position: "absolute",
            opacity: 0,
            pointerEvents: "none"
        }, style)} />
        <div style={{
            overflow: "hidden",
            position: "relative",
            width,
            height
        }}>
            <img src={src} style={mergeObject<React.CSSProperties | undefined>({
                objectFit: "cover",
                position: "absolute",
                maxWidth: width,
                maxHeight: height,
                zIndex: 2,
            })} />
            <ImageMock size={300} colors={pixels} x={details} y={details} style={{
                width,
                height,
            }}/>
        </div>
    </>

    if(!pixels)
        return <div style={{
            position: "absolute"
        }}>
            <img src={src} style={{
                position: "absolute",
                width: "100%",
                zIndex: 2
            }} />
        </div>
    return <div style={{
        position: "relative",
        width: "100%" ,
        height: "fit-content",
        overflow: "hidden",
        aspectRatio: "2 / 1"
    }}>
        <img src={src} style={{
            position: "relative",
            width: "100%",
            zIndex: 2,
        }} />
        <ImageMock size={280} colors={pixels} x={details} y={details} style={{
            width: "100%",
            height: "100%",
        }}/>
    </div>
}

export const ImageMock = ({colors, x, y, size = 120, style}:{
    colors: Pixel[],
    x: number,
    y: number,
    size?: number,
    style?: CSSProperties
}) => {
    return <div style={Object.assign({
        backgroundColor: "#fff",
        overflow: "hidden"
    }, style)}>
        {colors.map((pixel, i)=> <div key={i} style={{
            backgroundColor: `rgba(${pixel.R}, ${pixel.G}, ${pixel.B}, 0.5)`,
            position: "absolute",
            top: `${i / x * 10 - 10}%`,
            left: `${i%x / x * 100 - 10}%`,
            width: size,
            height: size,
            borderRadius: "100%",
            backdropFilter: "blur( 60px )",
            opacity: .5
        }} />)}
        <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backdropFilter: "blur(12px)"
        }} />
    </div>
}