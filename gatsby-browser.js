/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import videojs from 'video.js'
import ASSSubtitlesSwitcher from "./src/utils/videojs-ass-subtitles-switcher"
import Octopus from "./src/utils/videojs-octopus"
require("normalize.css")

videojs.log.level("off")
videojs.registerPlugin("ASSSubtitlesSwitcher", ASSSubtitlesSwitcher)
videojs.registerPlugin("Octopus", Octopus)