import BooruImage from "@/components/booruImage"
import BooruImageInfinite from "@/components/booruImageInfinite"
import ImageLines from "@/components/imagelines"
import {req} from "@/lib/fetch"

const Page = async () => {
  const posts = await req<any>("/post", {
    isSSR: true
  })
  const tags = await req<any>("/tag", {
    isSSR: true
  })
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
