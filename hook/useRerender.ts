import { useState } from "react"

export const useRerender = (): [number, ()=> void] => {
    const [_, s_] = useState(() => Math.random())
    return [_, ()=> s_(Math.random())]
}