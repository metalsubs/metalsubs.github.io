import React from "react"
import videojs from "video.js"
import 'videojs-youtube'
import "video.js/dist/video-js.css"
import subtitles from '../utils/subtitles'

class Player extends React.Component {
  componentDidMount() {
    // Extend the options with some defaults.
    const options = {
      html5: {
        hls: {
          overrideNative: !videojs.browser.IS_SAFARI,
        },
      },
      ...this.props,
    }
    this.player = videojs(this.videoNode, options, function onPlayerReady() {
      // console.log('onPlayerReady', this);
    })

    this.player.addClass(`vjs-theme-${this.props.themeName}`)

    this.player.on("play", this.props.onPlay)
    this.player.on("ready", () => {
      console.log('Player is ready');
      subtitles(this.player);
    })
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
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
            className="video-js vjs-16-9"
            playsInline={this.props.playsInline}
          />
        </div>
      </div>
    )
  }
}

export default Player
