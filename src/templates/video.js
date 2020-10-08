import React from "react"
import VideoLayout from "../layouts/VideoLayout"
import SEO from "../components/seo"
import Player from "../components/player.jsx"

const VideoTemplate = ({ pageContext: { meta, page } }) => (
  <>
    <VideoLayout>
      <SEO title="Player" pathname={page.url} />
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
                src: `https://www.youtube.com/watch?v=${meta.youtubeID}`,
                type: "video/youtube",
                subtitle: `/subtitles/${meta.bandID}/${meta.songID}.ass`, //meta.subtitle,
                fonts: meta.fonts,
                url: page.url,
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
              src={require(`../images/bands/${meta.bandID}/${meta.covers.album}`)}
            />
          </div>
          <div>
            <p>{meta.song}</p>
            <p>{meta.band}</p>
          </div>
        </div>
      </div>
    </VideoLayout>
  </>
)


export default VideoTemplate
