import React from "react"
import { DiscussionEmbed } from "disqus-react"
import styled from "styled-components"
import Img from 'gatsby-image'
import VideoLayout from "../layouts/VideoLayout"
import SEO from "../components/SEO"
import Player from "../components/Player"
import media from "../utils/media-query"
import prepareInfo from "../utils/video-info"
import { graphql } from "gatsby"

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

const Cover = styled.div`
  width: 100%;
  max-width: ${p => p.theme.breakpoints.xs};
`

const CoverImage = styled(Img)`
  width: 100%;
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

const VideoTemplate = (data) => {
  const { meta, page, sources, videoJsASSSubtitlesSwitcher } = prepareInfo(data)
  return (
    <>
      <VideoLayout>
        <SEO title={page.title} pathname={page.path} />
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
              <CoverImage fluid={meta.covers.album} />
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
}

export default VideoTemplate
// export default Template

export const pageQuery = graphql`
  query VideoBySlug($slug: String!) {
    allSite {
      nodes {
        siteMetadata {
          title
          youtubeBaseURL
          subtitleBaseURL
          octopusWorkerURL
          fontsBaseURL
          videoSelector
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        layout
        title
        description
        date
        creation_date
        path
        draft
        band
        song
        bandID
        songID
        subtitle
        translations
        size {
          width
          height
          aspect_ratio
          x2
        }
        fonts
        youtubeID
        covers {
          album {
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          song {
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
