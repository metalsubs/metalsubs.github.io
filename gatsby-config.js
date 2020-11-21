module.exports = {
  siteMetadata: {
    title: `MetalSubs`,
    description: `Home of karaokes for metal songs`,
    author: `@metalsubs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `songs`,
        path: `${__dirname}/content/bands`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        displayName: true,
        fileName: true,
      },
    },
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: `Cardo:wght`,
              variants: [`400`, `700`],
            },
            {
              family: `Holtwood One SC`,
            },
          ],
        },
        formats: ["woff2", "woff"],
        useMinify: true,
        usePreload: true,
        usePreconnect: false,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-98315944-3",
        head: false,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `MetalSubs`,
        short_name: `MetalSubs`,
        start_url: `/`,
        background_color: `#191B1C`,
        theme_color: `#2d2d2d`,
        display: `minimal-ui`,
        icon: `src/images/metalsubs-logo.png`,
      },
    },
  ],
}
