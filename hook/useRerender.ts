import { useState } from "react"

export const useRerender = () => {
    const [_, s_] = useState(() => Math.random())
    return ()=> s_(Math.random())
}

export const useRerenderIf = (condition: boolean) => {
    const [_, s_] = useState(() => Math.random())
    return ()=> condition ? s_(Math.random()) : _
}