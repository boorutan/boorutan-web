"use client"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

const ImageModal = () => {
    const router = useRouter()
    const back = useCallback(() => {
        router.back()
    }, [router])
    return <div style={{
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
        }}>
            <button onClick={back}>back</button>
        </div>
    </div>
}
export default ImageModal