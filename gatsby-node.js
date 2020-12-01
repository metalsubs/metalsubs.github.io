const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const languages = [
    {
      code: 'us',
      language: 'English'
    },
    {
      code: 'es',
      language: 'Spanish'
    }
  ]

  const pageTemplate = path.resolve(`./src/templates/Video.jsx`)

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                path
                layout
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

    const {
      allMarkdownRemark: { edges: videos },
    } = result.data

    

    // console.log(JSON.stringify(result.data, null, 2))

    videos.forEach(video => {
      const { frontmatter } = video.node

      // console.log(">>> VIDEO", JSON.stringify(video, null, 2))

      if (frontmatter.layout === "video") {
        createPage({
          component: pageTemplate,
          path: frontmatter.path,
          slug: video.node.fields.slug,
          context: {
            slug: video.node.fields.slug,
          },
        })
      }
    })

    return null
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  // console.log('type', node.internal.type)

  if (node.internal.type === `MarkdownRemark`) {
    // const value = node.frontmatter.path
    const slug = createFilePath({ node, getNode, basePath: `pages` })

    // console.log('node', JSON.stringify(node, null, 2))
    // console.log("slug", slug)

    createNodeField({
      name: `slug`,
      node,
      value: slug,
    })
  }
}


exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /videojs-landscape-fullscreen/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
}