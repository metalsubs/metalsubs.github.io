import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Player from "../components/player.jsx"

const IndexPage = () => (
  <Layout>
    <SEO title="Player" />
    <Player
      controls
      sources={[
        // {
        //   src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
        //   type: "video/mp4"
        // },
        {
          src: "https://www.youtube.com/watch?v=v8amfLYjf9w",
          type: "video/youtube",
        },
      ]}
      onPlay={() => {}}
      playsInline
    />
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link> <br />
    <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
  </Layout>
)

export default IndexPage
