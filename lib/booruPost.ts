import {BooruImageListOption} from "@/hook/useBooruImageList";
import {req} from "@/lib/fetch";
import {getRatingTag} from "@/lib/booru";
import {Account} from "@/hook/useAccount";

const getPost = async (account: Account | null, settings: BooruImageListOption) => {
    const rating = settings.sensitiveFilterType == "hide" ? getRatingTag(settings?.showSensitiveLevel || []) : ""
    return await req<Array<any>>(`/${settings.like ? "account/like" : "post"}?page=${settings.page}&booru=${settings.booru}&tags=${settings.tags}${rating}${settings.bypassCache ? "&bypasscache=true" : ""}`, {
        header: {
            Account: account?.id || "anonymous"
        }
    })
}

export {
    getPost
}