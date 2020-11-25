import React from "react"

import "videojs-youtube"
import "video.js/dist/video-js.css"
import "videojs-landscape-fullscreen"
// import "videojs-contrib-quality-levels"
// import "videojs-hls-quality-selector"
import "../utils/videojs-ass-subtitles-switcher"
import "../utils/videojs-ass-subtitles-switcher.css"
import videojs from "video.js"

class Player extends React.Component {
  componentDidMount() {
    const { videoJsASSSubtitlesSwitcher, ...rest } = this.props
    const options = {
      html5: {
        hls: {
          overrideNative: !videojs.browser.IS_SAFARI,
        },
      },
      plugins: {
        videoJsASSSubtitlesSwitcher,
      },
      ...rest,
    }
    this.player = videojs(this.videoNode, options, function onPlayerReady() {
      // Noob
    });

    this.player.landscapeFullscreen({
      fullscreen: {
        enterOnRotate: true,
        alwaysInLandscapeMode: true,
        iOS: true,
      },
    });

    this.subtitles = null;

    this.player.addClass(`vjs-theme-${this.props.themeName}`)

    this.player.on("play", this.props.onPlay)
    this.player.on("ready", () => {
    })
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.videoJsASSSubtitlesSwitcher().dispose();
      this.player.dispose();
    }
  }

  render() {
    return (
      
        <div data-vjs-player>
          {/* eslint-disable jsx-a11y/media-has-caption */}
          <video
            ref={node => (this.videoNode = node)}
            className="video-js vjs-16-9 vjs-big-play-centered"
            playsInline={this.props.playsInline}
          />
        </div>
      
    )
  }
}

export default Player
