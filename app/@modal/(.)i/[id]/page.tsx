import ImageModal from "@/components/imagemodal"
import {req} from "@/lib/fetch";

const ImageModal_ = async ({ params: { id } }:{
    params: {
        id: number
    }
}) => {
    const post = await req<any>(`/post/${id}`)
    return <ImageModal post={post} />
}
export default ImageModal_