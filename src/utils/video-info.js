const languages = [
  {
    code: "us",
    language: "English",
  },
  {
    code: "es",
    language: "Spanish",
  },
]

const prepareInfo = ({
  data: {
    markdownRemark: { frontmatter },
    allSite: {
      nodes: {
        0: { siteMetadata },
      },
    },
  },
}) => ({
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
    fonts: frontmatter.fonts,
    youtubeID: frontmatter.youtubeID,
    covers: {
      album: frontmatter.covers.album.childImageSharp.fluid,
      song: frontmatter.covers.song.childImageSharp.fluid,
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
    subtitles: [
      {
        src: `${siteMetadata.subtitleBaseURL}${frontmatter.bandID}/${frontmatter.songID}.ass`,
        label: "Song Language",
        value: "song",
        selected: true,
      },
    ].concat(
      frontmatter.translations
        ? frontmatter.translations.map(translation => ({
            src: `${siteMetadata.subtitleBaseURL}${frontmatter.bandID}/${frontmatter.songID}.${translation}.ass`,
            label: languages.find(l =>
              new RegExp(`^${l.code}-[A-Z]+$`).test(translation)
            ).language,
            value: translation,
            selected: false,
          }))
        : []
    ),
    octopus: {
      videoSelector: siteMetadata.videoSelector,
      size: {
        width: frontmatter.size.width,
        height: frontmatter.size.height,
        x2: frontmatter.size.x2 || false,
      },
      debug: false,
      workerUrl: siteMetadata.octopusWorkerURL,
      fonts: frontmatter.fonts.map(
        font => `${siteMetadata.fontsBaseURL}${font}`
      ),
    },
    player: {
      aspectRatio: frontmatter.size.aspect_ratio || "16:9",
    },
  },
})

export default prepareInfo