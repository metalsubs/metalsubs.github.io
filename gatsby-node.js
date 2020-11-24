const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const pageTemplate = path.resolve(`./src/templates/Video.jsx`)

  return graphql(
    `
      {
        allSite {
          nodes {
            siteMetadata {
              title
              youtubeBaseURL
              subtitleBaseURL
              octopusWorkerURL
              fontsBaseURL
              videoSelector
            }
          }
        }
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
                translations
                size {
                  width
                  height
                }
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

    const {
      allMarkdownRemark: { edges: posts },
      allSite: {
        nodes: {
          0: { siteMetadata },
        },
      },
    } = result.data

    posts.forEach(async (post) => {
      const { frontmatter } = post.node
      if (frontmatter.layout === "video") {
        createPage({
          component: pageTemplate,
          path: frontmatter.path,
          context: {
            page: {
              url: frontmatter.path,
              layout: frontmatter.layout,
              title: frontmatter.title,
              description: frontmatter.description,
              date: frontmatter.date,
              creation_date: frontmatter.creation_date,
              path: frontmatter.path,
              draft: frontmatter.draft,
            },
            meta: {
              band: frontmatter.band,
              song: frontmatter.song,
              bandID: frontmatter.bandID,
              songID: frontmatter.songID,
              subtitle: frontmatter.subtitle,
              translations: frontmatter.translations,
              size: {
                width: frontmatter.size.width,
                height: frontmatter.size.height,
              },
              fonts: frontmatter.fonts,
              youtubeID: frontmatter.youtubeID,
              covers: {
                album: frontmatter.covers.album,
                song: frontmatter.covers.song,
              },
              octopusWorkerURL: siteMetadata.octopusWorkerURL,
            },
            sources: [
              {
                src: `${siteMetadata.youtubeBaseURL}${frontmatter.youtubeID}`,
                type: "video/youtube",
              },
            ],
            videoJsASSSubtitlesSwitcher: {
              videoSelector: siteMetadata.videoSelector,
              subtitles: [
                {
                  src: `${siteMetadata.subtitleBaseURL}${frontmatter.bandID}/${frontmatter.songID}.br`,
                  label: "<English>",
                  selected: true,
                },
              ].concat(
                frontmatter.translations
                  ? frontmatter.translations.map(translation => ({
                      src: `${siteMetadata.subtitleBaseURL}${frontmatter.bandID}/${frontmatter.songID}.${translation}.br`,
                      label: translation,
                      selected: false,
                    }))
                  : []
              ),
              octopus: {
                debug: false,
                workerUrl: siteMetadata.octopusWorkerURL,
                fonts: frontmatter.fonts.map(
                  font => `${siteMetadata.fontsBaseURL}${font}`
                ),
              },
            },
          },
        })
      }
    })

    return null
  })
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