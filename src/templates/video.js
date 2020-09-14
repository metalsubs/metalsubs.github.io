import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Player from "../components/player.jsx"

const VideoTemplate = ({
  pageContext: { band, title, youtubeID, subtitle, fonts, url },
}) => (
  <>
    {/*
        <MainLayout>
          <SiteMetadata pathname={post.frontmatter.path} />
          <Post>
            <PostMeta></PostMeta>
            <PostContent
              /*
              FIX ME
              eslint react/no-danger: 0
              *
              /
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </Post>
        </MainLayout>
        */}
    <Layout>
      <SEO title="Player" pathname={url} />
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
              {
                src: `https://www.youtube.com/watch?v=${youtubeID}`,
                type: "video/youtube",
                subtitle,
                fonts,
                url,
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
        <div style={{ display: "flex" }}>
          <div>
            <img
              alt=""
              src="https://t2.genius.com/unsafe/220x220/https%3A%2F%2Fimages.genius.com%2F88049b21f6e85d30030c6697a2c9d6ce.480x480x1.jpg"
            />
          </div>
          <div>
            <p>{title}</p>
            <p>{band}</p>
            <p>The Holographic Principle</p>
          </div>
        </div>
      </div>
    </Layout>
  </>
)


export default VideoTemplate
