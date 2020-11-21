const path = require(`path`)

const createImageQuery = imagePath => `
{
  allFile(filter: {relativePath: {eq: "${imagePath}"}}) {
    edges {
      node {
        absolutePath
        relativeDirectory
        relativePath
        dir
        publicURL
        base
        childImageSharp {
          fluid(grayscale: true) {
            originalName
            src
          }
        }
      }
    }
  }
}
`

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const pageTemplate = path.resolve(`./src/templates/Video.jsx`)

  return graphql(
    `
      {
        allMarkdownRemark(
          # filter: { frontmatter: { layout: { eq: "post" } } }
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              # fields {
              #  slug
              # }
              html
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
                fonts
                youtubeID
                covers {
                  album
                  song
                }
              }
            }
          }
        }
      }
    `
  ).then(async result => {
    if (result.errors) {
      throw result.errors
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach(async (post, index) => {

      if (post.node.frontmatter.layout === "video") {
        createPage({
          component: pageTemplate,
          path: post.node.frontmatter.path,
          context: {
            page: {
              url: post.node.frontmatter.path,
              layout: post.node.frontmatter.layout,
              title: post.node.frontmatter.title,
              description: post.node.frontmatter.description,
              date: post.node.frontmatter.date,
              creation_date: post.node.frontmatter.creation_date,
              path: post.node.frontmatter.path,
              draft: post.node.frontmatter.draft,
            },
            meta: {
              band: post.node.frontmatter.band,
              song: post.node.frontmatter.song,
              bandID: post.node.frontmatter.bandID,
              songID: post.node.frontmatter.songID,
              subtitle: post.node.frontmatter.subtitle,
              fonts: post.node.frontmatter.fonts,
              youtubeID: post.node.frontmatter.youtubeID,
              covers: {
                album: post.node.frontmatter.covers.album,
                song: post.node.frontmatter.covers.song,
              },
            },
          },
        })
      }
    })

    return null
  })
}
