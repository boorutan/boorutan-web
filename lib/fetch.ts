import baseurl, {ssrurl} from "@/lib/url";

export const req = async < T > (url : string, option? : {
    isResultArray?: boolean,
    isJSON?: boolean,
    isSSR?: boolean
    ContentType?: string,
    method? : "GET" | "POST" | "DELETE",
    body? : object | void | null | any,
}) : Promise < T > => {
    console.log(`${baseurl}${url}`)
    const _res = await fetch(`${option?.isSSR ? ssrurl : baseurl}${url}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "ja,en-US;q=0.9,en;q=0.8,ja-JP;q=0.7",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Content-type": option ?. ContentType || (option ?. isJSON === false ? "application/json" : "application/json")
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": option?.body ? option ?. isJSON === false ? option?.body : JSON.stringify(option?.body) : null,
        "method": option?.method || "GET",
        "credentials": "include",
        "cache": "no-store"
    })
    const body = await _res.text()
    console.log(body)
    return await JSON.parse(body)
}
