import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Player from "../components/player.jsx"

const IndexPage = () => (
  <Layout>
    <SEO title="Player" />
    <div
      style={{
        backgroundColor: "black",
      }}
    >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 1440,
          padding: 0,
          backgroundColor: "black",
        }}
      >
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
      </div>
    </div>
    <div
      style={{
        margin: "1rem 2rem",
        color: "#fff",
        fontSize: "2rem",
      }}
    >
      <p>Wisdom - Marching for Liberty</p>
    </div>
  </Layout>
)

export default IndexPage
