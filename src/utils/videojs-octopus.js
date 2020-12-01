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
    // canvas.style.border = "1px solid green"

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

    // const __resize = () => this.resizePlayerWithTimeout();

    document.addEventListener("fullscreenchange", this.resizePlayerWithTimeout)
    document.addEventListener("mozfullscreenchange", this.resizePlayerWithTimeout)
    document.addEventListener("webkitfullscreenchange", this.resizePlayerWithTimeout)
    document.addEventListener("msfullscreenchange", this.resizePlayerWithTimeout)
    window.addEventListener("resize", this.resizePlayerWithTimeout)

    if (this.player.videoWidth() > 0) {
      // instance.resize(840, 460, 0, 0);
      this.resizePlayerWithTimeout()
    } else {
      this.player.on("loadedmetadata", this.resizePlayerWithTimeout)
    }
  }

  resizePlayer() {
    videojs.log("octupus: resizePlayer")
    // var size = {
    //   width: 1312, //1920,
    //   height: 960 //1080,
    // }
    this.canvas.style.display = "block"
    this.canvas.style.position = "absolute"

    if (this.player && this.player.el_) {
      if (this.player.el_.offsetWidth) {
        this.canvas.style.width = this.player.el_.offsetWidth + "px"
      }

      if (this.player.el_.offsetHeight) {
        this.canvas.style.height = this.player.el_.offsetHeight + "px"
      }
    }

    this.canvas.style.height = this.player.el_.offsetHeight + "px"
    this.canvas.style.top = "0px" //this.player.el_.offsetTop + "px";
    this.canvas.style.left = "0px" // this.player.el_.offsetLeft + "px";
    this.canvas.style.pointerEvents = "none"

    if (
      this.player &&
      this.player.el_ &&
      this.player.el_.offsetWidth !== undefined &&
      this.player.el_.offsetHeight !== undefined &&
      this.player.el_.offsetTop !== undefined &&
      this.player.el_.offsetLeft !== undefined
    ) {
      this.octopus.resize(
        this.size.width, //this.player.el_.offsetWidth,
        this.size.height, //this.player.el_.offsetHeight,
        0, // this.player.el_.offsetTop,
        0 // this.player.el_.offsetLeft
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
