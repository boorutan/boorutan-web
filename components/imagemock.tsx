import {CSSProperties, useEffect, useState} from "react";

type Pixel = {
    R: Number,
    G: Number,
    B: Number
}

export const SimpleImageMock = ({details = 5, src, pixels}: {
    details?: number,
    src: string,
    pixels: Pixel[]
}) => {
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
        position: "relative"
    }}>
        <img src={src} style={{
            position: "absolute",
            width: "100%",
            zIndex: 2
        }} />
        <ImageMock size={280} colors={pixels} x={details} y={details} style={{
            width: "100%",
            aspectRatio: "1 / 1"
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
        position: "relative",
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