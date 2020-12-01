import React from "react"
import { graphql } from "gatsby"
import { Link as GatsbyLink } from "gatsby"
import styled from "styled-components"
import Img from "gatsby-image"

import MainLayout from "../layouts/MainLayout.jsx"
import SEO from "../components/SEO"
import media from "../utils/media-query"

const Wrapper = styled.div`
  width: 100%;
  margin: 0 1rem;
`

const Container = styled.div`
  width: 100%;
  max-width: ${p => p.theme.breakpoints.xl};
  margin: 0 auto;
`

const Songs = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: stretch;
  padding: 0;
  max-width: ${p => p.theme.breakpoints.xl};
`

const Link = styled(GatsbyLink)`
  width: 100%;
  display: block;
  margin: 1rem;
  position: relative;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;

  :hover {
    transform: scale(1.05, 1.05);
  }


  ${media.greaterThan("md")`
    width: calc((100% / 2) - 3rem);
    height: calc(100% / 2);
  `}

  ${media.lessThan("md")`
    width: 100%;
    height: 100%;
  `}
`

const CustomImage = styled(Img)`
  width: 100%;
`

const Description = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.15);

  transition: all 0.3s ease-in-out;

  ${media.greaterThan("xl")`
    font-size: 2rem;
  `}

  ${media.between("lg", "xl")`
    font-size: 1.5rem;
  `}

  ${media.between("md", "lg")`
    font-size: 1rem;
  `}

  ${media.lessThan("md")`
    position: relative;
    font-size: 2.5rem;
    text-align: center;
  `}
  bottom: 0;
  left: 0;
  color: white;
  z-index: 16;
  width: 100%;
  font-family: Cardo;
  font-size: 1.5rem;
  padding: 1rem;
`

const BackgroundLayer = styled.div`
  background-image: url(${p => p.image});
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  position: absolute;
  top: 0%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
`

const IndexPage = ({ songs }) => {
  return (
    <MainLayout>
      <SEO title="Home" />
      <Wrapper>
        <Container>
          <Songs>
            {songs &&
              songs.length > 0 &&
              songs.map(song => (
                <Link key={song.path} to={song.path}>
                  <CustomImage fluid={song.image} alt={song.title} />
                  <Description>{song.title}</Description>
                  <BackgroundLayer
                    data-name="BackgroundLayer"
                    image={song.image.base64}
                  />
                </Link>
              ))}
          </Songs>
        </Container>
      </Wrapper>
    </MainLayout>
  )
}

const MapResponse = Component => result =>
  Component({
    songs: result.data.allMarkdownRemark.nodes.map(song => ({
      path: song.frontmatter.path,
      title: song.frontmatter.title,
      image: song.frontmatter.covers.song.childImageSharp.fluid,
    })),
  })

export default MapResponse(IndexPage)

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      nodes {
        frontmatter {
          title
          path
          covers {
            song {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          bandID
          songID
          date
        }
      }
    }
  }
`
