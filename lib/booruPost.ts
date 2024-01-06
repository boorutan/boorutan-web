import {BooruImageList, BooruImageListOption} from "@/hook/useBooruImageList";
import {req} from "@/lib/fetch";
import {getRatingTag} from "@/lib/booru";

const getPost = async (settings: BooruImageListOption) => {
    const rating = settings.sensitiveFilterType == "hide" ? getRatingTag(settings?.showSensitiveLevel || []) : ""
    const post = await req<Array<any>>(
        `/${settings.like ? "like" : "post"}?page=${settings.page}&booru=${settings.booru}&tags=${settings.tags}${rating}${settings.bypassCache?"&bypasscache=true":""}`
    )
    return post
}

export {
    getPost
}