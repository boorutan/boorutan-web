export const mergeObject = <T extends  Object | undefined = any>(...objects: Array<T>) => {
    return objects.filter((obj) => typeof obj == "object" && !!obj).reduce((acc: any, obj: any)=> {
        Object.keys(obj as Object).map((k)=> {
            if(
                (
                    Object.keys(acc).includes(k)
                        && ![null, undefined].includes(acc[k])
                        && !obj[k]
                )
                ||
                (
                    Array.isArray(acc[k])
                        && acc[k].length
                )
            ) return
            acc[k] = obj[k]
        })
        return acc
    },{})
}

export const mergeObjectForce = (...objects: Array<any>) => {
    return objects.filter((obj) => typeof obj == "object" && !!obj).reduce((acc, obj)=> {
        Object.keys(obj).map((k)=> {
            acc[k] = obj[k]
        })
        return acc
    },{})
}

export const optionObjectValue2String = (object: any) => {
    return Object.keys(object).reduce((acc: any, k)=> {
        acc[k] = object[k] || ""
        return acc
    }, {})
}