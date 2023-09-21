const getSampleUrl = (post: any) => post.preview_url || post.media_asset.variants ?. filter((p : any) => p.type == "sample")[0] ?. url || post.file_url
const getExtension = (src: string) => src.split(".")[src.split(".").length - 1]
export {
    getSampleUrl,
    getExtension
}