import { BooruImageList, BooruImageListOption, Fn } from "@/hook/useBooruImageList"
import { useBooruManager } from "@/hook/useBooruManager"
import { useWindowManager } from "@/hook/useWindowManager"

export const BooruWindowManager = ({setSettings}:{
    setSettings: ((s: BooruImageListOption | Fn<BooruImageList, BooruImageListOption>) => void)
}) => {
    const manager = useBooruManager({
        setSettings
    })
    const wnidows = useWindowManager()
    return <div></div>
}