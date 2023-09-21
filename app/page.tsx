import BooruImage from "@/components/booruImage"
import BooruImageInfinite from "@/components/booruImageInfinite"
import ImageLines from "@/components/imagelines"
import { req } from "@/lib/fetch"

const Page = async () => {
  const posts = await req<any>("/post")
  return <Home data={{
    posts
  }} />
}

const Home = ({data: { posts }}: any) => {
  return <div style={{
    display: "flex",
  }}>
      <BooruImageInfinite init={posts} />
  </div>
  return <div>
    <ImageLines posts={posts} line_length={3} />
  </div>
  return <div>{posts.map((post: any)=> <div>
    <BooruImage src={post.preview_url || post.media_asset.variants.filter((p: any)=> p.type == "sample")[0]?.url || post.file_url} />
  </div>)}</div>
}

export {
  Page as default
}
