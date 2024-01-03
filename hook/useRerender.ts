import { useState } from "react"

export const useRerender = () => {
    const [_, s_] = useState(() => Math.random())
    return ()=> s_(Math.random())
}