import React from "react"
import { graphql } from "gatsby"
import { Link as GatsbyLink } from "gatsby"
import styled from "styled-components"
import Img from 'gatsby-image'

// import Layout from "../components/layout"
import MainLayout from "../layouts/MainLayout.jsx"
import SEO from "../components/SEO"
import media from "../utils/media-query"

// import coverImage from "../images/bands/wisdom/marching-for-liberty/cover.jpg"

const SongsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  /* background-color: red; */
  /* padding: 5px; */
`

const SongContainer = styled.div`
  /* outline: 1px solid blue; */
  position: relative;

  flex: 0 1 50%;

  ${media.lessThan("md")`
    flex: 0 1 100%;
  `}

  display: flex;
  justify-content: space-evenly;
  /* margin: 0 px; */
`

const Link = styled(GatsbyLink)`
  /* width: 100%; */
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin: 10px;
  z-index: 10;
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

// const Picture = styled.img`
//   display: block;
//   width: 100%;
//   z-index: 14;
// `

const SetImg = styled(Img)`
  display: block !important;
  margin: 0 auto;
  // above don't really do anything in this case
  flex-grow: 1; // use as much space as available
  width: 700px; // or set a specific size and it'll be centered within the available space of the flex parent.
  /* width: 100%; */
`

const Description = styled.div`
  position: absolute;
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
  margin: 10px;
`

const Song = ({ url, bandID, songID, title, covers }) => {
  // const image = require(`../images/bands/${bandID}/${covers.song}`)
  console.log({ title, song: covers.song })
  return (
    <SongContainer data-name="SongContainer">
      <Link to={url} data-name="Link">
        <SetImg
          fluid={covers.song.childImageSharp.fluid}
          alt={title}
          data-name="Picture"
        />
        {/* <Picture
          src={covers.song.childImageSharp.fluid.src}
          alt={title}
          data-name="Picture"
        /> */}
        <Description>{title}</Description>
        <BackgroundLayer
          data-name="BackgroundLayer"
          image={covers.song.childImageSharp.fluid.base64}
        />
      </Link>
    </SongContainer>
  )
}

const IndexPage = ({
  data: {
    allMarkdownRemark: { nodes: songs },
  },
}) => {
  return (
    <MainLayout>
      <SEO title="Home" />
      <SongsContainer data-name="SongsContainer">
        {songs && songs.length === 0 && <div>Cargando...</div>}
        {songs &&
          songs.length > 0 &&
          songs.map(song => (
            <Song
              key={song.frontmatter.path}
              url={song.frontmatter.path}
              band={song.frontmatter.band}
              title={song.frontmatter.title}
              bandID={song.frontmatter.bandID}
              songID={song.frontmatter.songID}
              covers={song.frontmatter.covers}
              data-name="Song"
            />
          ))}
      </SongsContainer>
    </MainLayout>
  )
}

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

export default IndexPage
