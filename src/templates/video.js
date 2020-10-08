import React from "react"
import styled from 'styled-components'
import VideoLayout from "../layouts/VideoLayout"
import SEO from "../components/seo"
import Player from "../components/player.jsx"

const Container = styled.div`
  background-color: black;
`

const PlayerContainer = styled.div`
  margin: 0 auto;
  max-width: ${p => p.theme.breakpoints.xl};
  padding: 0;
`

const Meta = styled.div`
  margin: 1rem 2rem;
  color: #fff;
  font-size: 2rem;

  display: flex;
  justify-content: center;
`

const InfoContainer = styled.div`
  display: flex;
  max-width: ${p => p.theme.breakpoints.xl};

  width: 100%;
  display: flex;
`

const Cover = styled.div``
const Info = styled.div`
  margin-left: 1rem;
`

const VideoTemplate = ({ pageContext: { meta, page } }) => (
  <>
    <VideoLayout>
      <SEO title="Player" pathname={page.url} />
      <Container>
        <PlayerContainer>
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
        </PlayerContainer>
      </Container>
      <Meta>
        <InfoContainer>
          <Cover>
            <img
              alt=""
              src={require(`../images/bands/${meta.bandID}/${meta.covers.album}`)}
            />
          </Cover>
          <Info>
            <h1>{meta.song}</h1>
            <h2>{meta.band}</h2>
          </Info>
        </InfoContainer>
      </Meta>
    </VideoLayout>
  </>
)


export default VideoTemplate
