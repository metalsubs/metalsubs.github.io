import React from "react"
import VideoLayout from "../layouts/VideLayout"
import SEO from "../components/seo"
import Player from "../components/player.jsx"

const VideoTemplate = ({
  pageContext: { band, title, youtubeID, subtitle, fonts, url, cover },
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
    <VideoLayout>
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
            <img alt="" src={require(`../images/bands${cover}`)} />
          </div>
          <div>
            <p>{title}</p>
            <p>{band}</p>
          </div>
        </div>
      </div>
    </VideoLayout>
  </>
)


export default VideoTemplate
