import ImageModal from "@/components/imagemodal"
import {req} from "@/lib/fetch";

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
        createDanBooruCategoryHelper(post.tag_string_general, "0"),
        createDanBooruCategoryHelper(post.tag_string_artist, "1"),
        createDanBooruCategoryHelper(post.tag_string_copyright, "3"),
        createDanBooruCategoryHelper(post.tag_string_character, "4"),
        createDanBooruCategoryHelper(post.tag_string_meta, "5"),
    )
}

const ImageModal_ = async ({ params: { id } }:{
    params: {
        id: number
    }
}) => {
    const post = await req<any>(`/post/${id}`)
    const tags = post.tags
    if (tags) {
        const category = await req<any>(`/category?tag=${tags}`, {
            isResultArray: true
        })
        return <ImageModal category={createMoeBooruCategory(category)} post={post} />
    }
    return <ImageModal category={createDanBooruCategory(post)} post={post} />

}
export default ImageModal_