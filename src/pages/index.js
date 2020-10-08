import React from "react"
import { graphql } from "gatsby"
import { Link as GatsbyLink } from "gatsby"
import styled from "styled-components"

// import Layout from "../components/layout"
import MainLayout from "../layouts/MainLayout.jsx"
import SEO from "../components/seo"

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
  display: flex;
  /* margin: 0 px; */
`

const Link = styled(GatsbyLink)`
  width: 100%;
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

const Picture = styled.img`
  display: block;
  width: 100%;
  z-index: 14;
`
  

const Description = styled.div`
  position: absolute;
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
  const image = require(`../images/bands/${bandID}/${covers.song}`)
  return (
    <SongContainer data-name="SongContainer">
      <Link to={url} data-name="Link">
        <Picture src={image} alt={title} data-name="Picture" />
        <Description>{title}</Description>
        <BackgroundLayer data-name="BackgroundLayer" image={image} />
      </Link>
    </SongContainer>
  )
}

const IndexPage = ({
  data: {
    allMarkdownRemark: { nodes: songs },
  },
}) => {
  console.log("songs", songs)
  return (
    <MainLayout>
      <SEO title="Home" />

      <SongsContainer data-name="SongsContainer">
        {songs.map(song => (
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
            song
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
