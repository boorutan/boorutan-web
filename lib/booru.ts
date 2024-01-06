const getSampleUrl = (post: any) => post.preview_url || post.media_asset.variants ?. filter((p : any) => p.type == "sample")[0] ?. url || post.file_url
const getOriginalUrl = (post: any) => post.file_url || post.media_asset.variants?.filter((p: any)=> p.type == "original")[0]?.url || getSampleUrl(post)
const getExtension = (src: string) => src.split(".")[src.split(".").length - 1]
const createMoeBooruCategory = (category: any[]): any => {
    return category.reduce((acc, v)=> {
        acc[v.Name] = v.Category
        return acc
    }, {})
}

const createDanBooruCategoryHelper = (tags: string, type: string) => {
    return tags.split(" ").reduce((acc: any, v)=> {
        acc[v] = type
        return acc
    }, {})
}
const createDanBooruCategory = (post: any) => {
    return Object.assign(
        createDanBooruCategoryHelper(post.tag_string_artist, "1"),
        createDanBooruCategoryHelper(post.tag_string_character, "4"),
        createDanBooruCategoryHelper(post.tag_string_copyright, "3"),
        createDanBooruCategoryHelper(post.tag_string_general, "0"),
        createDanBooruCategoryHelper(post.tag_string_meta, "5"),
    )
}

const getCategoryData = (post: any, category: any, type: string, none: string) => {
    const character = Object.keys(category).filter((v: any)=> category[v] == type)
    if(character.length)
        return character.reduce((acc: string, v: any, i: number)=> {
            return i ? `${acc},${v}` : v
        }, "")
    return none
}

const getTitle = (post: any, category: any) => {
    return getCategoryData(post, category, "4", "Original")
}

const getDescription = (post: any, category: any) => {
    return getCategoryData(post, category, "3", "Original")
}

const getRating = (post: any): number => {
    const rating = post.rating.toLowerCase()
    if(rating == "g") return 0
    if(rating == "s") return 1
    if(rating == "q") return 2
    if(rating == "e") return 3
    return 4
}

const getRatingTag = (sensitiveLevel: Array<number>) => {
    if(!sensitiveLevel.length)
        return ""
    return " rating:".concat(sensitiveLevel.map((v)=> ["general", "sensitive", "questionable", "explicit"][v]).join(","))
}

const isNSFW = (post: any): boolean => {
    return getRating(post) > 1
}

export {
    getSampleUrl,
    getOriginalUrl,
    getExtension,
    getTitle,
    getDescription,
    getCategoryData,
    createMoeBooruCategory,
    createDanBooruCategory,
    getRating,
    isNSFW,
    getRatingTag
}