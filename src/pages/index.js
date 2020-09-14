import React from "react"
import { graphql } from "gatsby"
import { Link as GatsbyLink } from "gatsby"
import styled from 'styled-components'

// import Layout from "../components/layout"
import MainLayout from "../layouts/MainLayout.jsx"
import SEO from "../components/seo"

const SongsContainer = styled.div`
  /*
  margin-bottom: 1.45rem;
  */
  display: flex;
`

const Link = styled(GatsbyLink)`
  display: block;
  
`

Link.displayName = 'Link'

const SongContainer = styled.div`
  
`

const Picture = styled.img`
  width: 100%;
`

const Song = ({ url, band, title }) => (
  <SongContainer data-name="SongContainer">
    <Link to={url} data-name="Link">
      <Picture
        src={`/bands${url}/cover.jpg`}
        alt={`${band} - ${title}`}
        data-name="Picture"
      />
    </Link>
  </SongContainer>
)

const IndexPage = ({
  data: {
    allBandsJson: { edges: songs },
  },
}) => (
  <MainLayout>
    <SEO title="Home" />
    <SongsContainer data-name="SongsContainer">
      {songs.map(song => (
        <Song
          key={song.node.url}
          url={song.node.url}
          band={song.node.band}
          title={song.node.title}
          data-name="Song"
        />
      ))}
    </SongsContainer>
  </MainLayout>
)

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allBandsJson(limit: 1000, sort: { order: DESC, fields: [band] }) {
      edges {
        node {
          band
          id
          subtitle
          title
          url
          youtubeID
        }
      }
    }
  }
`

export default IndexPage
