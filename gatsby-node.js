/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const videoComponent = path.resolve(`./src/templates/video.js`)
  // const quote = path.resolve(`./src/templates/video.jsx`)

  return graphql(
    `
      {
        allBandsJson {
          edges {
            node {
              band
              id
              subtitle,
              fonts,
              title
              url
              youtubeID
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const songs = result.data.allBandsJson.edges

    songs.forEach((song, index) => {
      // const previous = index === posts.length - 1 ? null : posts[index + 1].node
      // const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: song.node.url,
        component: videoComponent,
        context: {
          band: song.node.band,
          title: song.node.title,
          youtubeID: song.node.youtubeID,
          subtitle: song.node.subtitle,
          fonts: song.node.fonts,
          url: song.node.url,
        },
        internal: {
          type: 'Song'
        }
      })
    })

    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  console.log(">>> node to create", node);

  if (node.internal.type === `MarkdownRemark`) {
    const value = node.frontmatter.path

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }

  if (node.internal.type === `BandsJson`) {
    const value = node.url

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
