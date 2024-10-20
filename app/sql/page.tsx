"use client"
import {useEffect, useState} from "react";
import {useBooruStream} from "@/hook/useBooruStream";
import ImageLines from "@/components/imagelines";
import {useAccount} from "@/hook/useAccount";
import { mergeObject } from "@/lib/utils/object";
import {Button, ButtonContainer, ButtonInput, SelectorItemContainer} from "@/components/booruSelector";

const fixValueType = (value: string) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value && !isNaN(Number(value))) return Number(value);
    return value;
}

const csvToJson = (csv: string, separate_value: string = ",") => {
    if(!csv) return []
    const lines = csv.split("\n");
    const header = lines[0].split(separate_value);
    return lines.slice(1).map(line => {
        const values = line.split(separate_value);
        const obj: any = {};
        header.forEach((h, i) => {
            obj[h] = fixValueType(values[i]);
        });
        return obj;
    });
}

const SqlPage = () => {
    const [account, setAccount] = useAccount()

    const [csv, setCsv] = useState("")

    const json = csvToJson(csv)
        .map((post)=> mergeObject({preview_url: post.file_url},post))
        .filter((post)=> post.preview_url)
    console.log(csvToJson(csv),json)

    return <div style={{
        marginTop: 16,
    }}>
        <SelectorItemContainer style={{
            padding: 5,
            marginBottom:4
        }}>
            <ButtonContainer>
                <textarea style={{
                    height: 44,
                    maxWidth: 800,
                    borderRadius: 100,
                    border: "1px solid #f5f5f5",
                    outline: "none",
                    paddingLeft: 16,
                    fontFamily: "ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace",
                    fontSize: "1em",
                    padding: "2px 32px",
                    resize: "none",
                    width: "100%"
                }} value={csv} onChange={(e)=> setCsv(e.target.value)} />
            </ButtonContainer>
        </SelectorItemContainer>
        <ImageLines posts={json} showSensitiveLevel={[0, 1, 2, 3]} line_length={3} booru={"danbooru"} account={account} />
    </div>
}
export default SqlPage