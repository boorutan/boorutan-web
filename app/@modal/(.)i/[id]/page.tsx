import ImageModal from "@/components/imagemodal"
import {req} from "@/lib/fetch";

const ImageModal_ = async ({ params: { id } }:{
    params: {
        id: number
    }
}) => {
    const post = await req<any>(`/post/${id}`)
    const tags = post.tags || post.tag_string
    const category = await req<any>(`/category?tag=${tags}`, {
        isResultArray: true
    })
    return <ImageModal category={category} post={post} />
}
export default ImageModal_