export const req = async < T > (url : string, method : "GET" | "POST" | "DELETE" = "GET", body : object | void | null | any = null, option? : {
    isJSON?: boolean,
    ContentType?: string
}) : Promise < T > => {
    const _res = await fetch(`http://127.0.0.1:8080${url}`, {
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
        "body": body ? option ?. isJSON === false ? body : JSON.stringify(body) : null,
        "method": method,
        "credentials": "include",
        "cache": "no-store"
    })
    return await _res.json()
}
