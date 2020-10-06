import React from "react"
import { graphql } from "gatsby"
import { Link as GatsbyLink } from "gatsby"
import styled from "styled-components"

// import Layout from "../components/layout"
import MainLayout from "../layouts/MainLayout.jsx"
import SEO from "../components/seo"

import coverImage from "../images/bands/wisdom/marching-for-liberty/cover.jpg"

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

  /* background-image: url(https://i.ytimg.com/vi/v8amfLYjf9w/maxresdefault.jpg);
  background-size: cover;
  background-position: center;
  opacity: 1; */

  margin: 10px;
  z-index: 10;
`

const BackgroundLayer = styled.div`
  /* background-image: url(https://i.ytimg.com/vi/v8amfLYjf9w/maxresdefault.jpg); */
  background-image: url(${coverImage});
  background-size: cover;
  background-position: center;

  /* background-color: red; */
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
  /* flex: 0 1 auto; */
  /* border: 1px solid purple; */
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

const Song = ({ url, band, title }) => {
  const image = require(`../images/bands${url}/cover.jpg`)
  return (
    <SongContainer data-name="SongContainer" image={image}>
      <Link to={url} data-name="Link">
        <Picture src={image} alt={`${band} - ${title}`} data-name="Picture" />
        <Description>{`${band} - ${title}`}</Description>
        <BackgroundLayer data-name="BackgroundLayer" image={image} />
      </Link>
    </SongContainer>
  )
}

const data = [...Array(4).keys()]

const IndexPage = ({
  data: {
    allBandsJson: { edges: songs },
  },
}) => {
  return (
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
}

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
