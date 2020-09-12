import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({
  data: {
    allBandsJson: { edges: songs },
  },
}) => (
  <Layout>
    <SEO title="Home" />
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      {songs.map(song => (
        <Link
          key={song.node.url}
          to={song.node.url}
        >{`${song.node.band} - ${song.node.title}`}</Link>
      ))}
    </div>
    <Link to="/page-2/">Go to page 2</Link> <br />
    <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
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
