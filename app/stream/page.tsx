"use client"
import {useEffect} from "react";
import {useBooruStream} from "@/hook/useBooruStream";
import ImageLines from "@/components/imagelines";
import {useAccount} from "@/hook/useAccount";

const SettingsPage = () => {
    const booru = useBooruStream()
    const [account, setAccount] = useAccount()
    console.log(booru)
    return <div style={{
        marginTop: 16
    }}>
        <ImageLines posts={booru.posts} showSensitiveLevel={[0, 1, 2, 3]} line_length={3} booru={"danbooru"} account={account} />
    </div>
}
export default SettingsPage