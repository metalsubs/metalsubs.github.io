import React from "react"
import { DiscussionEmbed } from "disqus-react"
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

const Image = styled.img`
  width: 10rem;
  height: 10rem;
`

const Info = styled.div`
  margin-left: 1rem;
`

const SongTitle = styled.h1`
  font-size: 4rem;
  margin: 0;
`

const SongArtist = styled.h1`
  font-size: 3rem;
  margin: 1rem 0;
`

const Comments = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  > div {
    width: 100%;
    max-width: ${p => p.theme.breakpoints.xl};
  }
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
                subtitle: `/subtitles/${meta.bandID}/${meta.songID}.br`, //meta.subtitle,
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
            <Image
              alt=""
              src={require(`../images/bands/${meta.bandID}/${meta.covers.album}`)}
            />
          </Cover>
          <Info>
            <SongTitle>{meta.song}</SongTitle>
            <SongArtist>{meta.band}</SongArtist>
          </Info>
        </InfoContainer>
      </Meta>
      <Comments>
        <DiscussionEmbed
          shortname={"metalsubs"}
          config={{
            identifier: page.url,
            title: page.title,
          }}
        />
      </Comments>
    </VideoLayout>
  </>
)


export default VideoTemplate
