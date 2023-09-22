const getSampleUrl = (post: any) => post.preview_url || post.media_asset.variants ?. filter((p : any) => p.type == "sample")[0] ?. url || post.file_url
const getOriginalUrl = (post: any) => post.file_url || post.media_asset.variants?.filter((p: any)=> p.type == "original")[0]?.url || getSampleUrl(post)
const getExtension = (src: string) => src.split(".")[src.split(".").length - 1]
export {
    getSampleUrl,
    getOriginalUrl,
    getExtension
}