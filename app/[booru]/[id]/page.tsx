import ImageModal_ from "@/app/@modal/(.)[booru]/[id]/page";

const ImagePage = async ({ params: { id, booru } }:{
    params: {
        id: number,
        booru: string
    }
}) => {
    return <ImageModal_ params={{id, booru}} />
}
export default ImagePage