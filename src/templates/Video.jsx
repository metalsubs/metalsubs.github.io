import React from "react"
import { DiscussionEmbed } from "disqus-react"
import styled from "styled-components"
import Img from "gatsby-image"
import VideoLayout from "../layouts/VideoLayout"
import SEO from "../components/SEO"
import Player from "../components/Player"
import media from "../utils/media-query"
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

const VideoTemplate = ({
  meta,
  page,
  sources,
  videoJsASSSubtitlesSwitcher,
}) => (
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

const MapResponse = Component => ({
  data: {
    markdownRemark: { frontmatter },
    allSite: {
      nodes: {
        0: { siteMetadata },
      },
    },
  },
}) =>
  Component({
    page: {
      url: frontmatter.path,
      layout: frontmatter.layout,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      creation_date: frontmatter.creation_date,
      path: frontmatter.path,
      draft: frontmatter.draft,
    },
    meta: {
      band: frontmatter.band,
      song: frontmatter.song,
      bandID: frontmatter.bandID,
      songID: frontmatter.songID,
      subtitle: frontmatter.subtitle,
      translations: frontmatter.translations || [],
      fonts: frontmatter.fonts,
      youtubeID: frontmatter.youtubeID,
      covers: {
        album: frontmatter.covers.album.childImageSharp.fluid,
        song: frontmatter.covers.song.childImageSharp.fluid,
      },
      octopusWorkerURL: siteMetadata.octopusWorkerURL,
    },
    sources: [
      {
        src: `${siteMetadata.youtubeBaseURL}${frontmatter.youtubeID}`,
        type: "video/youtube",
      },
    ],
    videoJsASSSubtitlesSwitcher: {
      subtitles: [
        {
          src: `${siteMetadata.subtitleBaseURL}${frontmatter.bandID}/${frontmatter.songID}.ass`,
          label: "Song Language",
          value: "song",
          selected: true,
        },
      ].concat(
        frontmatter.translations
          ? frontmatter.translations.map(translation => ({
              src: `${siteMetadata.subtitleBaseURL}${frontmatter.bandID}/${frontmatter.songID}.${translation}.ass`,
              label: siteMetadata.languages.find(l =>
                new RegExp(`^${l.code}-[A-Z]+$`).test(translation)
              ).language,
              value: translation,
              selected: false,
            }))
          : []
      ),
      octopus: {
        videoSelector: siteMetadata.videoSelector,
        size: {
          width: frontmatter.size.width,
          height: frontmatter.size.height,
          x2: frontmatter.size.x2 || false,
          aspectRatio: frontmatter.size.aspect_ratio || "16:9",
        },
        debug: false,
        workerUrl: siteMetadata.octopusWorkerURL,
        fonts: frontmatter.fonts.map(
          font => `${siteMetadata.fontsBaseURL}${font}`
        ),
      },
      player: {
        aspectRatio: frontmatter.size.aspect_ratio || "16:9",
      },
    },
  })

export default MapResponse(VideoTemplate)
// export default VideoTemplate

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
          languages {
            code
            language
          }
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
