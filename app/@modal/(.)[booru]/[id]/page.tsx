import ImageModal from "@/components/imagemodal"
import {req} from "@/lib/fetch";
import {createDanBooruCategory, createMoeBooruCategory} from "@/lib/booru";


const ImageModal_ = async ({ params: { id, booru } }:{
    params: {
        id: number,
        booru: string
    }
}) => {
    const post = await req<any>(`/post/${id}?booru=${booru}`, {
        isSSR: true
    })
    const tags = post.tags
    if (tags) {
        const category = await req<any>(`/category?tag=${tags}`, {
            isResultArray: true,
            isSSR: true
        })
        return <ImageModal category={createMoeBooruCategory(category)} post={post} />
    }
    return <ImageModal category={createDanBooruCategory(post)} post={post} />

}
export default ImageModal_