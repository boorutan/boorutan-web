import {useLocalStorage} from "@/hook/useLocalStorage";
import {useEffectApi} from "@/hook/useApi";
import {useState} from "react";


export type Account = {
    id: string
}
export const useAccount = (): [null | Account, (account: Account)=> void] => {
    const id = crypto.randomUUID().replaceAll("-","")
    const [accounts, setAccounts] = useLocalStorage<null | Account>("accounts", (value)=> {
        if(!value) {
            const value = {
                id
            }
            localStorage.setItem("accounts", JSON.stringify(value))
            return value
        }
        return value
    }, null)
    return [accounts, (account: Account)=> {
        setAccounts(account)
    }]
}