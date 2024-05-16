import {useEffect, useState} from "react";

export const useLocalStorageList = () => {
    const [state, setState] = useState<Array<string>>([])
    useEffect(() => {
        setState(Object.keys(localStorage))
    }, []);
    return state
}