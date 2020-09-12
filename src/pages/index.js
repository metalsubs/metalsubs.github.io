import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Song = ({ url, band, title }) => (
  <div style={{ display: "flex" }}>
    <Link
      style={{ display: "block" }}
      key={url}
      to={url}
    >
      <img
        src={`/bands${url}/cover.jpg`}
        alt={`${band} - ${title}`}
      />
    </Link>
  </div>
)

const IndexPage = ({
  data: {
    allBandsJson: { edges: songs },
  },
}) => (
  <Layout>
    <SEO title="Home" />
    <div style={{ marginBottom: `1.45rem` }}>
      {songs.map(song => (
        <Song url={song.node.url} band={song.node.band} title={song.node.title} />
      ))}
    </div>
  </Layout>
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
