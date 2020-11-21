import React from "react"
import videojs from "video.js"
import "videojs-youtube"
import "video.js/dist/video-js.css"
import loadable from "@loadable/component"
import subtitles from "../utils/subtitles"

loadable(() => import("videojs-landscape-fullscreen"))

class Player extends React.Component {
  componentDidMount() {
    const options = {
      html5: {
        hls: {
          overrideNative: !videojs.browser.IS_SAFARI,
        },
      },
      ...this.props,
    }
    this.player = videojs(this.videoNode, options, function onPlayerReady() {
      // Noob
    });

    if (this.player && this.player.landscapeFullscreen) {
      this.player.landscapeFullscreen({
        fullscreen: {
          enterOnRotate: true,
          alwaysInLandscapeMode: true,
          iOS: true,
        },
      });
    }

    this.subtitles = null;

    this.player.addClass(`vjs-theme-${this.props.themeName}`)

    this.player.on("play", this.props.onPlay)
    this.player.on("ready", () => {
      this.subtitles = subtitles(
        this.player,
        this.props.sources[0].subtitle,
        this.props.sources[0].fonts.map(font => `/fonts/${font}`)
      )
    })
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }

    if (this.subtitles) {
      this.subtitles.dispose()
      this.subtitles = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.themeName !== this.props.themeName) {
      this.player.removeClass(`vjs-theme-${this.props.themeName}`)
      this.player.addClass(`vjs-theme-${nextProps.themeName}`)

      this.player.src(nextProps.sources)
      this.player.poster(nextProps.poster)
    }
  }
  render() {
    return (
      <div>
        <div data-vjs-player>
          {/* eslint-disable jsx-a11y/media-has-caption */}
          <video
            ref={node => (this.videoNode = node)}
            className="video-js vjs-16-9 vjs-big-play-centered"
            playsInline={this.props.playsInline}
          />
        </div>
      </div>
    )
  }
}

export default Player
