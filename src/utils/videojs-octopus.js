import videojs from "video.js"
import SubtitlesOctopus from "libass-wasm"

const Plugin = videojs.getPlugin("plugin")

class Octopus extends Plugin {
  constructor(player, options) {
    super(player, options)

    if (
      !this.player.ASSSubtitlesSwitcher &&
      typeof this.player.ASSSubtitlesSwitcher !== "function"
    ) {
      videojs.log.error(`ASSSubtitlesSwitcher plugin mus be registered first`)
      return
    }

    const { videoSelector, size, ...octopusOptions } = options
    const videoElement = document.querySelector(videoSelector)
    this.canvas = octopusOptions.canvas = this.createCanvasElement(videoElement)
    this.size = size.x2
      ? {
          width: size.width * 2,
          height: size.height * 2
        }
      : size
    // this.size = size
    this.aspectRatio = {
      value: size.aspectRatio,
      width: size.aspectRatio.split(":")[0],
      height: size.aspectRatio.split(":")[1],
    }
    octopusOptions.canvas = this.canvas
    octopusOptions.subUrl = this.player
      .ASSSubtitlesSwitcher()
      .getCurrentSubtitle().src

    this.octopus = new SubtitlesOctopus(octopusOptions)
    this.configurePlayer()
  }

  createCanvasElement(videoElement) {
    const canvas = document.createElement("canvas")
    const canvasParent = document.createElement("div")
    canvas.className = "libassjs-canvas"
    canvas.style.display = "none"
    // canvas.style.border = "2px solid red"

    canvasParent.className = "libassjs-canvas-parent"
    canvasParent.appendChild(canvas)

    if (videoElement.nextSibling) {
      videoElement.parentNode.insertBefore(
        canvasParent,
        videoElement.nextSibling
      )
    } else {
      videoElement.parentNode.appendChild(canvasParent)
    }

    return canvas
  }

  timeupdate() {
    this.octopus.setCurrentTime(
      this.player.currentTime() + this.octopus.timeOffset
    )
  }

  configurePlayer() {
    this.player.on("timeupdate", () => this.timeupdate)

    this.player.on("playing", () => {
      videojs.log("octupus: playing")
      this.octopus.setIsPaused(
        false,
        this.player.currentTime() + this.octopus.timeOffset
      )
    })

    this.player.on("pause", () => {
      videojs.log("octupus: pause")
      this.octopus.setIsPaused(
        true,
        this.player.currentTime() + this.octopus.timeOffset
      )
    })

    this.player.on("seeking", () => {
      videojs.log("octupus: seeking")
      this.player.off("timeupdate", this.timeupdate)
    })

    this.player.on("seeked", () => {
      videojs.log("octupus: seeked")
      this.player.on("timeupdate", this.timeupdate)
      this.octopus.setCurrentTime(
        this.player.currentTime() + this.octopus.timeOffset
      )
    })

    this.player.on("ratechange", () => {
      videojs.log("octupus: ratechange")
      this.octopus.setRate(this.player.playbackRate())
    })

    this.player.on("timeupdate", () => {
      videojs.log("octupus: timeupdate")
      this.octopus.setCurrentTime(
        this.player.currentTime() + this.octopus.timeOffset
      )
    })

    this.player.on("waiting", () => {
      videojs.log("octupus: waiting")
      this.octopus.setIsPaused(
        true,
        this.player.currentTime() + this.octopus.timeOffset
      )
    })

    document.addEventListener("fullscreenchange", this.resizePlayerWithTimeout)
    document.addEventListener("mozfullscreenchange", this.resizePlayerWithTimeout)
    document.addEventListener("webkitfullscreenchange", this.resizePlayerWithTimeout)
    document.addEventListener("msfullscreenchange", this.resizePlayerWithTimeout)
    window.addEventListener("resize", this.resizePlayerWithTimeout)

    if (this.player.videoWidth() > 0) {
      this.resizePlayerWithTimeout()
    } else {
      this.player.on("loadedmetadata", this.resizePlayerWithTimeout)
    }
  }

  resizePlayer() {
    videojs.log("octupus: resizePlayer")

    if (
      this.player &&
      this.player.el_ &&
      this.player.el_.offsetWidth !== undefined &&
      this.player.el_.offsetHeight !== undefined &&
      this.player.el_.offsetTop !== undefined &&
      this.player.el_.offsetLeft !== undefined
    ) {
      const ratioWidth =
        (this.player.el_.offsetHeight / this.aspectRatio.height) *
        this.aspectRatio.width
      const ratioOffsetWidth = (this.player.el_.offsetWidth - ratioWidth) / 2

      if (ratioWidth < 1280) {
        this.canvas.width = this.size.width
        this.canvas.height = this.size.height
      } else {
        this.canvas.width = ratioWidth
        this.canvas.height = this.player.el_.offsetHeight
      }
      this.canvas.style.display = "block"
      this.canvas.style.position = "absolute"
      this.canvas.style.width = ratioWidth + "px"
      this.canvas.style.height = this.player.el_.offsetHeight + "px"
      this.canvas.style.top = "0px"
      this.canvas.style.left = ratioOffsetWidth + "px"
      this.canvas.style.pointerEvents = "none"

      this.octopus.resize(
        ratioWidth,
        this.player.el_.offsetHeight,
        this.player.el_.offsetTop, 
        ratioOffsetWidth
      )

      this.octopus.setCurrentTime(
        this.player.currentTime() + this.octopus.timeOffset
      )
    }
  }

  resizePlayerWithTimeout = () => {
    this.resizePlayer()
    setTimeout(() => this.resizePlayer(), 100)
  }

  setTrackByUrl(track) {
    this.octopus.setTrackByUrl(track)
  }

  dispose() {
    super.dispose()
    this.octopus.dispose()

    document.removeEventListener("fullscreenchange", this.resizePlayerWithTimeout)
    document.removeEventListener("mozfullscreenchange", this.resizePlayerWithTimeout)
    document.removeEventListener(
      "webkitfullscreenchange",
      this.resizePlayerWithTimeout
    )
    document.removeEventListener("msfullscreenchange", this.resizePlayerWithTimeout)
    window.removeEventListener("resize", this.resizePlayerWithTimeout)

    videojs.log("the Octupus plugin is being disposed")
  }
}

export default Octopus
