import React from "react"
import { DiscussionEmbed } from "disqus-react"
import styled from "styled-components"
import VideoLayout from "../layouts/VideoLayout"
import SEO from "../components/SEO"
import Player from "../components/Player"
import media from "../utils/media-query"

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

  ${media.lessThan("md")`
    margin: 1rem;
  `}
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
  align-items: center;
  ${media.lessThan("md")`
    flex-direction: column;
    text-align: center;
  `}
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

  ${media.lessThan("md")`
    margin: 0.5rem;
    font-size: 3rem;
  `}
`

const SongArtist = styled.h1`
  font-size: 3rem;
  margin: 1rem 0;

  ${media.lessThan("md")`
    font-size: 2.5rem;
  `}
`

const Comments = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  ${media.lessThan("md")`
    margin: 1rem;
  `}

  > div {
    width: 100%;
    max-width: ${p => p.theme.breakpoints.xl};
  }
`

const VideoTemplate = ({
  pageContext: { meta, page, sources, videoJsASSSubtitlesSwitcher },
}) => {
  console.log("videoJsASSSubtitlesSwitcher", videoJsASSSubtitlesSwitcher);
  return (
    <>
      <VideoLayout>
        <SEO title={page.title} pathname={page.url} />
        <Container>
          <PlayerContainer>
            <Player
              controls
              videoJsASSSubtitlesSwitcher={videoJsASSSubtitlesSwitcher}
              sources={sources}
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
        <pre>{JSON.stringify(page, null, 2)}</pre>
        <pre>{JSON.stringify(meta, null, 2)}</pre>
        <pre>{JSON.stringify(videoJsASSSubtitlesSwitcher, null, 2)}</pre>
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
}

export default VideoTemplate
