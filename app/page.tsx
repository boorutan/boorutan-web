import BooruImage from "@/components/booruImage"
import BooruImageInfinite from "@/components/booruImageInfinite"
import ImageLines from "@/components/imagelines"
import {req, reqSSR} from "@/lib/fetch"

const Page = async () => {
  const posts = await reqSSR<any>("/post")
  const tags = await reqSSR <any>("/tag")
  return <Home data={{
    posts,
    tags
  }} />
}

const Home = ({data: { posts, tags }}: any) => {
  return <div style={{}}>
      <BooruImageInfinite init={{
        posts,
        tags
      }} />
  </div>
}

export {
  Page as default
}
