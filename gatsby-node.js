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
              html
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
      allMarkdownRemark: { edges: pages },
    } = result.data

    pages.forEach(page => {
      const { frontmatter } = page.node

      if (frontmatter.layout === "video") {
        createPage({
          component: path.resolve(`./src/templates/Video.jsx`),
          path: frontmatter.path,
          slug: page.node.fields.slug,
          context: {
            slug: page.node.fields.slug,
          },
        })
      }

      if (frontmatter.layout === "page") {
        createPage({
          component: path.resolve(`./src/templates/Page.jsx`),
          path: frontmatter.path,
          slug: page.node.fields.slug,
          context: {
            slug: page.node.fields.slug,
            html: page.node.html,
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